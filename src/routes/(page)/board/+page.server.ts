import { db, type ChannelWithLastMessage } from '$lib/server/db';

import type { PageServerLoad } from './$types';

// https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety/operating-against-partial-structures-of-model-types
async function getMessageWithUser(channelId: string) {
	const message = await db.message.findFirst({
		where: { channelId },
		orderBy: { updatedAt: 'desc' },
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
	return message;
}

export const load: PageServerLoad = async () => {
	const channels: ChannelWithLastMessage[] = await db.channel.findMany({
		orderBy: { updatedAt: 'desc' }
	});
	// get last message with user
	for (const channel of channels) {
		const message = await getMessageWithUser(channel.id);
		channel.lastMessage = message;
	}
	// sort
	channels.sort((a, b) => {
		if (a.lastMessage && b.lastMessage) {
			if (a.lastMessage.updatedAt > b.lastMessage.updatedAt) return -1;
			if (b.lastMessage.updatedAt > a.lastMessage.updatedAt) return 1;
			return 0;
		}
		if (a.lastMessage) return -1;
		if (b.lastMessage) return 1;
		if (a.updatedAt > b.updatedAt) return -1;
		if (b.updatedAt > a.updatedAt) return 1;
		return 0;
	});

	return {
		channels
	};
};
