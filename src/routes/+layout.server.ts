import { redirect } from '@sveltejs/kit';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	const count = await db.user.count();
	if (count === 0 && url.pathname !== URLS.SIGNUP) {
		throw redirect(302, URLS.SIGNUP);
	}
	const session = await locals.auth.validate();
	return {
		user: session ? session.user : undefined
	};
}) satisfies LayoutServerLoad;
