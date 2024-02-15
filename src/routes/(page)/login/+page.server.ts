import { fail, redirect } from '@sveltejs/kit';

// import { LuciaError } from 'lucia';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';
import { createSessionCookie, lucia, verifyPassword } from '$lib/server/lucia';
import { hasAdminRole } from '$lib/utils';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	username: z.string().min(1),
	password: z.string().min(1)
});

export const load = (async ({ parent }) => {
	const data = await parent();
	if (data.user) {
		redirect(302, hasAdminRole(data.user) ? URLS.ADMIN : URLS.BOARD());
	}

	const form = await superValidate(zod(schema));
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		// validate
		const formData = await request.formData();
		const form = await superValidate(formData, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			const user = await db.user.findUnique({
				where: { username: form.data.username.toLowerCase() }
			});
			if (user) {
				const isValid = await verifyPassword(form.data.password, user.hashedPassword);
				if (isValid) {
					await db.user.update({
						where: { id: user.id },
						data: { lastLoginAt: new Date() }
					});

					const session = await lucia.createSession(user.id, {});
					createSessionCookie(session, cookies);
					// const sessionCookie = lucia.createSessionCookie(session.id);
					// cookies.set(sessionCookie.name, sessionCookie.value, {
					// 	path: '.',
					// 	...sessionCookie.attributes
					// });
					return { form };
				}
			}
			return message(form, 'Your login ID or password is incorrect.', {
				status: 400
			});
		} catch (e) {
			console.log(e);
		}
		return message(form, 'An error occurred.', {
			status: 400
		});
	}
};
