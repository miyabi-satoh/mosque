import { redirect } from '@sveltejs/kit';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';
import { deleteSessionCookie, invalidateSession } from '$lib/server/lucia';

import type { Actions, PageServerLoad } from './$types';

type ItemT = {
	href: string;
	title: string;
	external: boolean;
};

export const load = (async () => {
	// const exams = await db.exam.findMany({
	// 	orderBy: { sortOrder: 'asc' }
	// });

	const links = await db.link.findMany({
		orderBy: [{ sortOrder: 'desc' }, { title: 'asc' }]
	});

	const archives = await db.archive.findMany({
		where: { items: { some: { published: true } } },
		orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }]
	});
	const items: ItemT[] = [
		// ...exams.map((exam) => {
		// 	return {
		// 		href: `/${exam.examType}`,
		// 		title: `${exam.name}アーカイブ`,
		// 		external: false
		// 	};
		// }),
		// {
		// 	href: '/archives',
		// 	title: 'その他のアーカイブ',
		// 	external: false
		// },
		...archives.map((archive) => {
			return {
				href: URLS.ARCHIVES(archive.path),
				title: archive.title,
				external: false
			};
		}),
		...links.map((link) => {
			return {
				href: link.url,
				title: link.title,
				external: true
			};
		})
	];

	return {
		items
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	logout: async ({ locals, cookies }) => {
		await invalidateSession(locals.session);
		deleteSessionCookie(cookies);
		// const sessionCookie = lucia.createBlankSessionCookie();
		// cookies.set(sessionCookie.name, sessionCookie.value, {
		// 	path: '.',
		// 	...sessionCookie.attributes
		// });
		redirect(302, '/'); // redirect to root page
	}
};
