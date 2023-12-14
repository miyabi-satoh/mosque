import { error, fail, redirect } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { PROVIDERID_USERNAME, URLS } from '$lib/consts';
import { UserRoleEnumSchema } from '$lib/schemas/zod';
import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';
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
				throw error(404, 'Not found');
			}
			return await auth.getUser(params.id);
		} else {
			return data.user;
		}
	})();

	const schema = params.id ? adminSchema : userSchema;
	const form = await superValidate(schema);
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
	default: async ({ locals, request, params }) => {
		// get session
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/');
		}
		// set user id
		const userId = params.id ?? session.user.userId;

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
						await auth.useKey(PROVIDERID_USERNAME, session.user.username.toLowerCase(), val);
						return true;
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
		const form = await superValidate(formData, updateSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// get user
			const user = await auth.getUser(userId);
			const id = `${PROVIDERID_USERNAME}:${user.username}`;
			// update key
			await db.key.update({
				where: { id },
				data: { id: `${PROVIDERID_USERNAME}:${form.data.username}` }
			});
			// update user attributes
			await auth.updateUserAttributes(userId, {
				...exclude(form.data, ['password', 'newPassword']),
				fullName: form.data.fullName ?? undefined
			});
			// update password
			if (form.data.newPassword) {
				await auth.updateKeyPassword(
					PROVIDERID_USERNAME,
					form.data.username,
					form.data.newPassword
				);
			}
			// clear(recreate) session
			await auth.invalidateAllUserSessions(userId);
			if (!params.id) {
				const newSession = await auth.createSession({
					userId,
					attributes: {}
				});
				locals.auth.setSession(newSession);
			}

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
