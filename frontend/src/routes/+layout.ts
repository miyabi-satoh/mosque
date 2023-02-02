import { apiPages } from '$lib/api/pages';
import type { LayoutLoad } from './$types';

export const load = (async ({ url, fetch }) => {
	// サイドメニューの項目を読み込み
	const menuItems = await apiPages.getMenuItems(fetch);
	// ページ情報を読み込み
	const pageInfo = await apiPages.getByPathname(fetch, url.pathname);

	return {
		menuItems,
		pageInfo
	};
}) satisfies LayoutLoad;
