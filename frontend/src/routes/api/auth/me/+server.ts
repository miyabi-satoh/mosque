import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUser } from '$lib/server/session';
import { clearSecret } from '$lib/user';

// frontend/src/routes/api/auth/me/+server.ts
export const GET = (async ({ cookies }) => {
	console.log(`/api/auth/me`);

	const user = await getUser(cookies);
	if (user) {
		return json(clearSecret(user));
	}

	return new Response(`Session was expired.`, {
		status: 401
	});
}) satisfies RequestHandler;
