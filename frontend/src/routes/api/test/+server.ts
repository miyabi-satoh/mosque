import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// frontend/src/routes/api/test/+server.ts
export const GET = (async () => {
	return json({
		success: true
	});
}) satisfies RequestHandler;
