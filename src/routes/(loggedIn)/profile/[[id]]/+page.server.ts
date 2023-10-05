import { error, fail } from '@sveltejs/kit';

import type { User } from '@prisma/client';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { PROVIDERID_USERNAME } from '$lib/consts';
import { UserRoleEnumSchema } from '$lib/schemas/zod';
import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';
import { hasAdminRole } from '$lib/utils';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	username: z.string().min(4),
	displayName: z.string().min(2),
	password: z.string().min(1),
	// TODO: add email
	// email: z.string().email().nullish().or(z.literal('')),
	fullName: z.string().nullish(),
	role: UserRoleEnumSchema.optional(),
	newPassword: z.string().optional()
});

export const load = (async ({ parent, params, url }) => {
	const data = await parent();
	data.breadcrumbs.push({ label: 'Edit Profile', link: url.pathname });

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

	const form = await superValidate(schema);
	form.data = {
		...form.data,
		...user
	};

	return {
		form,
		breadcrumbs: data.breadcrumbs,
		userRoles: ['USER', 'STAFF', 'ADMIN'] as User['role'][]
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ locals, request, params }) => {
		// get session
		const session = await locals.auth.validate();
		if (!session) {
			throw error(400, 'Not found');
		}

		// validation schema
		const updateSchema = schema.extend({
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
		const form = await superValidate(request, updateSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const userId = params.id ?? session.user.userId;
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
				username: form.data.username,
				displayName: form.data.displayName,
				fullName: form.data.fullName ?? undefined,
				role: form.data.role ?? undefined
				// TODO: update email
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
			// todo: unique violation
			console.log(e);
		}
		return message(form, 'Failed to save', {
			status: 400
		});
	}
};
