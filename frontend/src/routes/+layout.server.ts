import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const prisma = new PrismaClient();

export const load = (async ({ url }) => {
	// console.log(`load @ frontend/src/routes/+layout.ts`);
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

	// console.log(menuItems);
	return {
		menuItems,
		pageMeta
	};
}) satisfies LayoutServerLoad;
