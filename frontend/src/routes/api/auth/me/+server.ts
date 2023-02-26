import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { COOKIE_SESSION } from '$lib/constants';
import { prisma } from '$lib/server/prisma';

// frontend/src/routes/api/auth/me/+server.ts
export const GET = (async ({ cookies }) => {
	const session = cookies.get(COOKIE_SESSION);
	if (session) {
		const user = await prisma.user.findFirst({
			where: {
				token: session
			}
		});
		if (user) {
			user.password = '';
			return json(user);
		}
	}

	return new Response(`Session was expired.`, {
		status: 401
	});
}) satisfies RequestHandler;
