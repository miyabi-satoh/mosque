import { json } from '@sveltejs/kit';

import { getMessagesWithUser } from '$lib/server/db';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { channelId } = params;
	// get messages
	const messages = await getMessagesWithUser(channelId);

	return json(messages);
};
