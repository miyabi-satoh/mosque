import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { ORIGIN, PORT } from '$env/static/private';

import { URLS } from '$lib/consts';
import { lucia } from '$lib/server/lucia';
import { isBoardEnabled } from '$lib/server/utils';
import { hasAdminRole } from '$lib/utils';

const handleSession: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
	}
	event.locals.user = user;
	event.locals.session = session;
	return resolve(event);
};

const handleAuth: Handle = async ({ event, resolve }) => {
	if (event.route.id?.startsWith('/(page)/(loggedIn)') && !event.locals.session) {
		console.log('session error by hooks.server.ts');
		redirect(302, '/');
	}
	if (event.url.pathname.startsWith(URLS.ADMIN) && !hasAdminRole(event.locals.user)) {
		console.log('role error by hooks.server.ts');
		redirect(302, '/');
	}
	if (
		event.url.pathname.startsWith(URLS.BOARD()) &&
		!isBoardEnabled(event.locals.user, event.request.headers.get('useer-agent'))
	) {
		console.log('reject board by hooks.server.ts');
		redirect(302, '/');
	}

	return await resolve(event);
};

export const handle = sequence(handleSession, handleAuth);

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
	if (request.url.startsWith(ORIGIN)) {
		// clone the original request, but change the URL
		request = new Request(request.url.replace(ORIGIN, `http://localhost:${PORT}/`), request);
	}

	return fetch(request);
};
