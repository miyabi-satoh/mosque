import { fail, redirect } from '@sveltejs/kit';

import { LuciaError } from 'lucia';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { PROVIDERID_USERNAME, URLS } from '$lib/consts';
import { auth } from '$lib/server/lucia';
import { hasAdminRole } from '$lib/utils';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	username: z.string().min(1),
	password: z.string().min(1)
});

export const load = (async ({ parent }) => {
	const data = await parent();
	if (data.user) {
		throw redirect(302, hasAdminRole(data.user) ? URLS.ADMIN : URLS.BOARD());
	}

	const form = await superValidate(schema);
	return {
		form
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// validate
		const formData = await request.formData();
		const form = await superValidate(formData, schema);
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			const key = await auth.useKey(
				PROVIDERID_USERNAME,
				form.data.username.toLowerCase(),
				form.data.password
			);
			await auth.deleteDeadUserSessions(key.userId);
			await auth.updateUserAttributes(key.userId, {
				lastLoginAt: new Date()
			});
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
			return { form };
		} catch (e) {
			if (e instanceof LuciaError) {
				if (e.message === 'AUTH_INVALID_PASSWORD' || e.message === 'AUTH_INVALID_KEY_ID') {
					return message(form, 'Your login ID or password is incorrect.', {
						status: 400
					});
				}
				console.log({ ...e });
			} else {
				console.log(e);
			}
		}
		return message(form, 'An error occurred.', {
			status: 400
		});
	}
};
