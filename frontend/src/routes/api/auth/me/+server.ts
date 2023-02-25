import type { RequestHandler } from './$types';

export const GET = (async ({ fetch, request }) => {
	const res = await fetch('http://127.0.0.1:1337/api/users/me', {
		headers: { Authorization: request.headers.get('Authorization') ?? '' }
	});

	return res;
}) satisfies RequestHandler;
