import type { Handle, HandleFetch } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { ORIGIN, PORT } from '$env/static/private';

import { auth } from '$lib/server/lucia';

const authHandler: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);

	return await resolve(event);
};

export const handle = sequence(authHandler);

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	if (request.url.startsWith(ORIGIN)) {
		// clone the original request, but change the URL
		request = new Request(request.url.replace(ORIGIN, `http://localhost:${PORT}/`), request);
	}

	return fetch(request);
};
