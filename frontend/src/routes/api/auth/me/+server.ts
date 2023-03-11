import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// TODO: 不要な気がする
export const GET = (async ({ locals }) => {
	console.log(`GET /routes/api/auth/me/+server.ts`);

	return json({
		user: locals.user
	});
}) satisfies RequestHandler;
