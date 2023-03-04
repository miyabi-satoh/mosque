import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUser } from '$lib/server/session';
import { clearSecret } from '$lib/user';

export const GET = (async ({ cookies }) => {
	console.log(`frontend/src/routes/api/auth/me/+server.ts`);

	const user = await getUser(cookies);
	return json(clearSecret(user));
}) satisfies RequestHandler;
