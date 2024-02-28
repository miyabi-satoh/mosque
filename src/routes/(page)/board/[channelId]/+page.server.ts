import { error, fail, type Actions, redirect } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { URLS } from '$lib/consts';
import { db, getMessagesWithUser } from '$lib/server/db';

import type { PageServerLoad } from './$types';

const schema = z.object({
	id: z.string().optional(),
	message: z.string().min(1).max(500)
});

export const load: PageServerLoad = async ({ params, parent }) => {
	// get channel
	const { channelId } = params;
	const channel = await db.channel.findUnique({
		where: { id: channelId }
	});
	if (!channel) {
		error(404, `Not found`);
	}

	// get messages
	const messages = await getMessagesWithUser({ where: { channelId } });

	const data = await parent();
	data.breadcrumbs.push({ label: channel.name, link: URLS.BOARD(channel.id) });

	const form = await superValidate(zod(schema));

	return {
		channel,
		messages,
		form
	};
};

export const actions: Actions = {
	default: async ({ locals, request, params }) => {
		// get session
		// const session = await locals.auth.validate();
		if (!locals.user) {
			redirect(302, '/');
		}

		// get channel id
		const { channelId } = params;
		if (!channelId) {
			error(400, 'Not found');
		}

		// validation
		const formData = await request.formData();
		const form = await superValidate(formData, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			if (!formData.has('delete')) {
				// upsert
				await db.message.upsert({
					where: { id: form.data.id ?? '' },
					create: {
						...form.data,
						channelId,
						userId: locals.user.id
					},
					update: {
						...form.data
					}
				});
			} else if (form.data.id) {
				// delete
				await db.message.delete({
					where: { id: form.data.id }
				});
			}
		} catch (e) {
			console.log(e);
			return message(form, 'Failed to send', {
				status: 400
			});
		}

		form.data.message = '';
		return { form };
	}
};
