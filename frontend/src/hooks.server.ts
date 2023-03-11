import type { Handle } from '@sveltejs/kit';
import { COOKIE_SESSION } from '$lib/constants';
import { prisma } from '$lib/server/prisma';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get(COOKIE_SESSION);
	if (session) {
		const user = await prisma.user.findUnique({
			where: {
				token: session
			},
			select: {
				id: true,
				username: true,
				type: true
			}
		});
		if (user) {
			event.locals.user = {
				id: user.id,
				username: user.username,
				type: user.type
			};
		}
	}

	return await resolve(event);
};
