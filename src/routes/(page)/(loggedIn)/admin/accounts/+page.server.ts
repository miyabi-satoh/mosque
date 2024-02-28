import { fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { UserRoleEnumSchema } from '$lib/schemas/zod';
import { db } from '$lib/server/db';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	checked: z.string().array(),
	role: UserRoleEnumSchema.nullish()
});

export const load: PageServerLoad = async () => {
	const users = await db.user.findMany({
		orderBy: { username: 'asc' }
	});

	const form = await superValidate(zod(schema));

	return {
		form,
		users
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		// todo: 見直す
		// validate form data
		const formData = await request.formData();
		const postSchema = schema.extend({
			checked: z.string()
		});
		const form = await superValidate(formData, zod(postSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		if (form.data.role) {
			for (const userId of form.data.checked.split(',')) {
				try {
					// update user attributes
					await db.user.update({
						where: { id: userId },
						data: { role: form.data.role }
					});
				} catch (e) {
					console.log(e);
					return message(form, 'The operation was failed.', {
						status: 400
					});
				}
			}
		}

		return message(form, 'The operation was successful.');
	}
};
