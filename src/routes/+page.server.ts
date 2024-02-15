import { redirect } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { lucia } from '$lib/server/lucia';

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
	logout: async ({ locals, cookies }) => {
		if (locals.session) {
			await lucia.invalidateSession(locals.session.id);
		}
		const sessionCookie = lucia.createBlankSessionCookie();
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes
		});
		redirect(302, '/'); // redirect to root page
	}
};
