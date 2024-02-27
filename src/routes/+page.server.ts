import { redirect } from '@sveltejs/kit';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';
import { deleteSessionCookie, invalidateSession } from '$lib/server/lucia';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// アーカイブリストを取得します
	const archives = await db.archive.findMany({
		where: { items: { some: { published: true } } },
		orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }]
	});

	// 外部リンクリストを取得します
	const links = await db.link.findMany({
		orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }]
	});

	// 取得したリストを配列にします
	const items = [
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

	return { items };
};

export const actions: Actions = {
	// ログアウト
	logout: async ({ locals, cookies }) => {
		await invalidateSession(locals.session);
		deleteSessionCookie(cookies);
		redirect(302, '/'); // redirect to root page
	}
};
