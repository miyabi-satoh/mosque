import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { ORIGIN, PORT } from '$env/static/private';

import { URLS } from '$lib/consts';
import { auth } from '$lib/server/lucia';
import { isBoardEnabled } from '$lib/server/utils';
import { hasAdminRole } from '$lib/utils';

const authHandler: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	const session = await event.locals.auth.validate();

	if (event.route.id?.startsWith('/(page)/(loggedIn)') && !session) {
		console.log('session error by hooks.server.ts');
		throw redirect(302, '/');
	}
	if (event.url.pathname.startsWith(URLS.ADMIN) && !hasAdminRole(session?.user)) {
		console.log('role error by hooks.server.ts');
		throw redirect(302, '/');
	}
	if (
		event.url.pathname.startsWith(URLS.BOARD()) &&
		!isBoardEnabled(session?.user, event.request.headers.get('useer-agent'))
	) {
		console.log('reject board by hooks.server.ts');
		throw redirect(302, '/');
	}

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
