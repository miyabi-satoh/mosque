import { error, fail, redirect } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { URLS } from '$lib/consts';
import { UserRoleEnumSchema } from '$lib/schemas/zod';
import { db } from '$lib/server/db';
import { hashPassword, lucia, verifyPassword } from '$lib/server/lucia';
import { exclude, hasAdminRole } from '$lib/utils';

import type { Actions, PageServerLoad } from './$types';

// TODO: verify email

const adminSchema = z.object({
	// required
	username: z.string().min(4).max(16),
	password: z.string().min(1),
	role: UserRoleEnumSchema,
	fullName: z.string().max(16),
	// nullable
	avatar: z.string().nullable(),
	email: z.string().email().nullable(),
	displayName: z.string().min(2).max(16).nullable(),
	newPassword: z.string().nullable()
});
const userSchema = adminSchema.extend({
	// optional(hidden)
	fullName: adminSchema.shape.fullName.optional(),
	role: adminSchema.shape.role.optional(),
	newPassword: adminSchema.shape.newPassword.optional()
});

export const load = (async ({ parent, params }) => {
	const data = await parent();
	data.breadcrumbs.push({ label: 'Edit Profile', link: URLS.PROFILE(params.id) });

	const user = await (async () => {
		if (params.id) {
			if (!hasAdminRole(data.user)) {
				error(404, 'Not found');
			}
			return await db.user.findUnique({
				where: { id: params.id }
			});
		} else {
			return data.user;
		}
	})();

	const schema = params.id ? adminSchema : userSchema;
	const form = await superValidate(zod(schema));
	form.data = {
		...form.data,
		...user,
		fullName: user?.fullName ?? undefined
	};

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ locals, request, params, cookies }) => {
		// get session
		// const session = await locals.auth.validate();
		if (!locals.user) {
			redirect(302, '/');
		}
		// set user id
		const userId = params.id ?? locals.user.userId;

		// validation schema
		const schema = params.id ? adminSchema : userSchema;
		const updateSchema = schema.extend({
			username: schema.shape.username.refine(async (val) => {
				try {
					const count = await db.user.count({
						where: {
							username: val,
							id: { not: userId }
						}
					});
					return count === 0;
				} catch (e) {
					console.log(e);
				}
				return false;
			}, 'The specified ID is already in use.'),
			displayName: schema.shape.displayName.refine(async (val) => {
				try {
					const count = await db.user.count({
						where: {
							displayName: val,
							id: { not: userId }
						}
					});
					return count === 0;
				} catch (e) {
					console.log(e);
				}
				return false;
			}, 'The specified name is already in use.'),
			password: schema.shape.password.refine(async (val) => {
				if (val.length > 0) {
					try {
						const user = await db.user.findUnique({
							where: { id: userId }
						});
						if (user) {
							return await verifyPassword(val, user.hashedPassword);
						}
					} catch (e) {
						console.log(e);
					}
				}
				return false;
			}, 'Incorrect password')
			// TODO: email validation
		});

		// validation
		const formData = await request.formData();
		const form = await superValidate(formData, zod(updateSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const hashedPassword = form.data.newPassword
				? await hashPassword(form.data.newPassword)
				: undefined;
			await db.user.update({
				where: { id: userId },
				data: {
					...exclude(form.data, ['password', 'newPassword']),
					fullName: form.data.fullName ?? undefined,
					hashedPassword
				}
			});
			// clear(recreate) session
			if (locals.session) {
				await lucia.invalidateSession(locals.session.id);
			}
			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});

			// clear form
			form.data.newPassword = '';
			form.data.password = '';

			return message(form, 'Account details have been saved.');
		} catch (e) {
			console.log(e);
		}
		return message(form, 'Failed to save', {
			status: 400
		});
	}
};
