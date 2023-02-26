import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// frontend/src/routes/api/auth/logout/+server.ts
export const GET = (async ({ cookies }) => {
	console.log(`/api/auth/logout`);
	cookies.delete('session', {
		path: '/'
	});
	return json({
		success: true
	});
}) satisfies RequestHandler;
