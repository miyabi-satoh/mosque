import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ url, locals }) => {
	console.log(`/routes/+layout.server.ts`);
	// サイドメニューの項目を読み込み
	const menuItems = await prisma.page.findMany({
		where: { is_menuitem: true },
		orderBy: {
			order: 'desc'
		}
	});
	if (!menuItems) {
		throw error(500, 'メニュー項目の取得に失敗しました');
	}

	const pageMeta = await prisma.page.findFirst({
		where: { url: url.pathname }
	});

	return {
		user: locals.user,
		menuItems,
		pageMeta
	};
}) satisfies LayoutServerLoad;
