import { fail, redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';

import type { Actions, PageServerLoad } from './$types';

type ItemT = {
	href: string;
	title: string;
	external: boolean;
};
export const load = (async ({ parent }) => {
	const data = await parent();

	const exams = await db.exam.findMany({
		orderBy: { sortOrder: 'asc' }
	});

	const links = await db.link.findMany({
		orderBy: { sortOrder: 'asc' }
	});

	const items: ItemT[] = [];
	exams.forEach((exam) => {
		items.push({
			href: `/${exam.examType}`,
			title: `${exam.name}アーカイブ`,
			external: false
		});
	});
	links.forEach((link) => {
		items.push({
			href: link.url,
			title: link.title,
			external: true
		});
	});

	return {
		items,
		breadcrumbs: data.breadcrumbs
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
