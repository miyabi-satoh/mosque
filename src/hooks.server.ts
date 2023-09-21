import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { auth } from '$lib/server/lucia';

const authHandler: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);

	return await resolve(event);
};

export const handle = sequence(authHandler);
