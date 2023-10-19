import { json } from '@sveltejs/kit';

import { getMessagesWithUser } from '$lib/server/db';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const search = formData.get('search')?.toString();
	if (search) {
		const messages = await getMessagesWithUser({
			where: {
				message: {
					contains: search,
					mode: 'insensitive'
				}
			},
			orderBy: { updatedAt: 'desc' }
		});
		return json(messages);
	}

	return json([]);
};
