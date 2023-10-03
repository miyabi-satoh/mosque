import { error, fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { PROVIDERID_USERNAME } from '$lib/consts';
import { auth } from '$lib/server/lucia';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	password: z.string().min(1),
	newPassword: z.string().min(4),
	confirmPassword: z.string().min(1)
});

export const load = (async () => {
	const form = await superValidate(schema);

	return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		// get session
		const session = await locals.auth.validate();
		if (!session) {
			throw error(400, 'Not found');
		}

		// validate form
		const updateSchema = schema
			.extend({
				password: schema.shape.password.refine(async (val) => {
					try {
						await auth.useKey(PROVIDERID_USERNAME, session.user.username.toLowerCase(), val);
					} catch (e) {
						return false;
					}
					return true;
				}, 'Current password does not match')
			})
			.refine((data) => data.newPassword === data.confirmPassword, {
				message: 'The password confirmation does not match',
				path: ['confirmPassword']
			});
		const form = await superValidate(request, updateSchema);
		if (!form.valid) return fail(400, { form });

		// update database
		try {
			// get user
			const userId = params.id ?? session.user.userId;
			const user = await auth.getUser(userId);

			// update password
			await auth.updateKeyPassword(
				PROVIDERID_USERNAME,
				user.username.toLowerCase(),
				form.data.newPassword
			);

			// clear form
			form.data.newPassword = '';
			form.data.password = '';
			form.data.confirmPassword = '';

			return message(form, 'Your password has been changed successfully.');
		} catch (e) {
			console.log(e);
		}
		return message(form, 'An error occurred.', {
			status: 400
		});
	}
};
