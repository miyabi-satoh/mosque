import { error, fail, type Actions, redirect } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';

import type { PageServerLoad } from './$types';

const schema = z.object({
	id: z.string().optional(),
	message: z.string().min(1).max(500)
});

export const load = (async ({ params, parent }) => {
	// get channel
	const { channelId } = params;
	const channel = await db.channel.findUnique({
		where: { id: channelId }
	});
	if (!channel) {
		throw error(404, `Not found`);
	}

	// get messages
	const messages = await db.message.findMany({
		where: { channelId },
		orderBy: { createdAt: 'asc' },
		include: {
			user: {
				select: {
					displayName: true,
					fullName: true,
					avatar: true
				}
			}
		}
	});

	const data = await parent();
	data.breadcrumbs.push({ label: channel.name, link: `${URLS.BOARD}/${channel.id}` });

	const form = await superValidate(schema);

	return {
		channel,
		messages,
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

		// get channel id
		const { channelId } = params;
		if (!channelId) {
			throw error(400, 'Not found');
		}

		// validation
		const formData = await request.formData();
		const form = await superValidate(formData, schema);
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
						userId: session.user.userId
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
