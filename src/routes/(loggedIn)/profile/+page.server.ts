import { error, fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { PROVIDERID_USERNAME } from '$lib/consts';
import { auth } from '$lib/server/lucia';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	username: z.string().min(4),
	displayName: z.string().min(4),
	password: z.string().min(1)
});

export const load = (async ({ parent }) => {
	const data = await parent();
	const form = await superValidate(schema);
	form.data = {
		...form.data,
		...data.user
	};
	return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		// get session
		const session = await event.locals.auth.validate();
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
		});

		// validation
		const form = await superValidate(event, updateSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const user = await auth.updateUserAttributes(session.user.userId, {
				username: form.data.username,
				displayName: form.data.displayName
			});
			await auth.invalidateAllUserSessions(user.userId);
			const newSession = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			event.locals.auth.setSession(newSession);

			return message(form, 'Your account details have been saved.');
		} catch (e) {
			console.log(e);
		}
		return message(form, 'Failed to save', {
			status: 400
		});
	}
};
