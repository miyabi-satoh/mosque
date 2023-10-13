import { fail, redirect } from '@sveltejs/kit';

import { Prisma, type Channel } from '@prisma/client';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';
import { exclude } from '$lib/utils';

import type { Actions, PageServerLoad } from './$types';

const channelSchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1),
	description: z.string().nullish(),
	private: z.boolean(),
	delete: z.boolean().default(false)
});

const messageWithUser = Prisma.validator<Prisma.MessageDefaultArgs>()({
	include: {
		user: {
			select: {
				avatar: true,
				displayName: true,
				fullName: true
			}
		}
	}
});
type MessageWithUser = Prisma.MessageGetPayload<typeof messageWithUser>;
type ChannelWithLastMessage = Channel & {
	lastMessage?: MessageWithUser | null;
};

export const load = (async () => {
	const channels: ChannelWithLastMessage[] = await db.channel.findMany({
		orderBy: { updatedAt: 'desc' }
	});
	for (const channel of channels) {
		const message = await db.message.findFirst({
			where: { channelId: channel.id },
			orderBy: { updatedAt: 'desc' },
			...messageWithUser
		});
		channel.lastMessage = message;
	}

	const form = await superValidate(channelSchema);

	return {
		form,
		channels
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// get session
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/');
		}

		const formData = await request.formData();
		const form = await superValidate(formData, channelSchema);
		if (!form.valid) return fail(400, { form });

		try {
			if (!form.data.id) {
				// CREATE post
				await db.channel.create({
					data: {
						...form.data,
						createdBy: session.user.userId,
						updatedBy: session.user.userId
					}
				});
			} else {
				// UPDATE post
				await db.channel.update({
					where: { id: form.data.id },
					data: {
						...exclude(form.data, ['id']),
						updatedBy: session.user.userId
					}
				});
			}
		} catch (e) {
			console.log(e);
			return message(form, 'Failed to update data.', {
				status: 400
			});
		}

		throw redirect(302, URLS.BOARD);
	}
};
