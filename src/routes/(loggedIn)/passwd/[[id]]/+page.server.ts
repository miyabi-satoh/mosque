import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import type { Actions, PageServerLoad } from '../$types';

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
	default: async ({ request, params }) => {
		const form = await superValidate(request, schema);
		// TODO:
		// validate
		return message(form, 'An error occurred.', {
			status: 400
		});
	}
};
