import { fail, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';

import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	const exam = await db.exam.findMany({
		orderBy: { sortOrder: 'asc' }
	});

	const links = await db.link.findMany({
		orderBy: { sortOrder: 'asc' }
	});

	return {
		exam,
		links
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		await auth.deleteDeadUserSessions(session.user.userId);
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/'); // redirect to root page
	}
};
