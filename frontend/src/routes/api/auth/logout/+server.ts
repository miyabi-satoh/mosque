import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ cookies }) => {
	console.log(`GET /routes/api/auth/logout/+server.ts`);
	cookies.delete('session', {
		path: '/'
	});
	return json({
		success: true
	});
}) satisfies RequestHandler;
