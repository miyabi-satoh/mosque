import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { COOKIE_SESSION } from '$lib/constants';
import { clearSecret, comparePassword } from '$lib/user';

// frontend/src/routes/api/auth/login/+server.ts
export const POST = (async ({ request, cookies }) => {
	const data: { username?: string; password?: string } = await request.json();
	if (data && data.username && data.password) {
		const user = await prisma.user.findFirst({
			where: {
				username: data.username,
				provider: 'local',
				confirmed: true,
				blocked: false
			}
		});
		if (user && comparePassword(data.password, user.password)) {
			const authToken = crypto.randomUUID();
			await prisma.user.update({
				where: {
					id: user.id
				},
				data: {
					token: authToken
				}
			});
			cookies.set(COOKIE_SESSION, authToken, {
				path: '/',
				maxAge: 60 * 60 * 24 * 7
			});
			return json(clearSecret(user));
		}
	}

	return new Response(`Invalid username or password.`, {
		status: 401
	});
}) satisfies RequestHandler;
