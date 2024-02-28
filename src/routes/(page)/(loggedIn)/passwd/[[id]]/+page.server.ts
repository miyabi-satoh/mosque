import { fail, redirect } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';
import { hashPassword, verifyPassword } from '$lib/server/lucia';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	password: z.string().min(1),
	newPassword: z.string().min(4),
	confirmPassword: z.string().min(1)
});

export const load: PageServerLoad = async ({ parent, params }) => {
	const data = await parent();
	data.breadcrumbs.push({ label: 'Change Password', link: URLS.PASSWD(params.id) });
	const form = await superValidate(zod(schema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		// get session
		// const session = await locals.auth.validate();
		if (!locals.user) {
			redirect(302, '/');
		}

		// validate form
		const updateSchema = schema
			.extend({
				password: schema.shape.password.refine(async (val) => {
					try {
						const user = await db.user.findUnique({
							where: { id: locals.user?.id }
						});
						if (user) {
							return await verifyPassword(val, user.hashedPassword);
						}
					} catch (e) {
						console.log(e);
					}
					return false;
				}, 'Current password does not match')
			})
			.refine((data) => data.newPassword === data.confirmPassword, {
				message: 'The password confirmation does not match',
				path: ['confirmPassword']
			});

		const formData = await request.formData();
		const form = await superValidate(formData, zod(updateSchema));
		if (!form.valid) return fail(400, { form });

		// update database
		try {
			// get user
			const userId = params.id ?? locals.user.id;
			const hashedPassword = await hashPassword(form.data.newPassword);
			await db.user.update({
				where: { id: userId },
				data: { hashedPassword }
			});

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
