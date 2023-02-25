import type { RequestHandler } from './$types';

export const POST = (async ({ fetch, request }) => {
	const json = await request.json();

	const res = await fetch('http://127.0.0.1:1337/api/auth/local', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
		body: JSON.stringify(json)
	});

	// console.log(json);

	return res;
}) satisfies RequestHandler;
