import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async () => {
	console.log(`GET /routes/api/test/+server.ts`);
	return json({
		success: true
	});
}) satisfies RequestHandler;
