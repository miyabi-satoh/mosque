import { fail, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';

import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const exam = await db.exam.findMany({
		orderBy: { sortOrder: 'asc' }
	});

	const siteLinks = await db.siteLink.findMany({
		orderBy: { sortOrder: 'asc' }
	});

	return {
		exam,
		siteLinks
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/'); // redirect to login page
	}
};
