import { fail, redirect } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';

import type { Actions, PageServerLoad } from './$types';

const channelSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1).max(50),
	description: z.string().max(100).nullish()
	// private: z.boolean()
});

export const load = (async ({ params, parent }) => {
	const data = await parent();
	data.breadcrumbs.push({
		label: `${params.id ? 'Edit' : 'Create a new'} channel`,
		link: URLS.BOARD_CHANNEL
	});

	const channel = params.id
		? await db.channel.findUnique({
				where: { id: params.id }
		  })
		: null;
	const form = await superValidate(channel, channelSchema);

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

		// validation
		const formData = await request.formData();
		const form = await superValidate(formData, channelSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		let redirectTo = '';
		try {
			if (!formData.has('delete')) {
				// upsert
				await db.channel.upsert({
					where: { id: params.id ?? '' },
					create: {
						...form.data,
						private: false,
						createdBy: session.user.userId,
						updatedBy: session.user.userId
					},
					update: {
						...form.data,
						updatedBy: session.user.userId
					}
				});

				if (params.id) {
					return message(form, `The channel has been saved.`);
				}
				redirectTo = URLS.BOARD();
			} else if (params.id) {
				// delete
				await db.channel.delete({
					where: { id: params.id }
				});
				redirectTo = URLS.BOARD();
			}
		} catch (e) {
			console.log(e);
		}

		if (redirectTo) {
			throw redirect(303, redirectTo);
		}

		return message(form, 'An error occurred.', {
			status: 400
		});
	}
};
