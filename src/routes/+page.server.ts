import { redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';

import type { Actions, PageServerLoad } from './$types';

type ItemT = {
	href: string;
	title: string;
	external: boolean;
};
export const load = (async () => {
	const exams = await db.exam.findMany({
		orderBy: { sortOrder: 'asc' }
	});

	const links = await db.link.findMany({
		orderBy: [{ sortOrder: 'desc' }, { title: 'asc' }]
	});

	const items: ItemT[] = [];
	exams.forEach((exam) => {
		items.push({
			href: `/${exam.examType}`,
			title: `${exam.name}アーカイブ`,
			external: false
		});
	});
	items.push({
		href: '/archives',
		title: 'その他のアーカイブ',
		external: false
	});
	links.forEach((link) => {
		items.push({
			href: link.url,
			title: link.title,
			external: true
		});
	});

	return {
		items
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (session) {
			await auth.invalidateSession(session.sessionId); // invalidate session
			await auth.deleteDeadUserSessions(session.user.userId);
		}
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, '/'); // redirect to root page
	}
};
