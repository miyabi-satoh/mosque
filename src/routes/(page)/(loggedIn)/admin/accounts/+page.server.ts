import { fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { UserRoleEnumSchema } from '$lib/schemas/zod';
import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	checked: z.string().array(),
	role: UserRoleEnumSchema.nullish()
});

export const load = (async () => {
	const users = await db.user.findMany({
		orderBy: { username: 'asc' }
	});

	const form = await superValidate(schema);

	return {
		form,
		users
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		// validate form data
		const formData = await request.formData();
		const postSchema = schema.extend({
			checked: z.string()
		});
		const form = await superValidate(formData, postSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		for (const userId of form.data.checked.split(',')) {
			try {
				// update user attributes
				await auth.updateUserAttributes(userId, {
					role: form.data.role ?? undefined
				});
			} catch (e) {
				console.log(e);
				return message(form, 'The operation was failed.', {
					status: 400
				});
			}
		}

		return message(form, 'The operation was successful.');
	}
};
