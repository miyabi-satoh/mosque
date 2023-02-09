import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { apiPages, strapiUrl } from '$lib/api';

export const load = (async ({ url, fetch }) => {
	// console.log(`load @ frontend/src/routes/+layout.ts`);
	// サイドメニューの項目を読み込み
	const menuItems = await apiPages.getMenuItems(fetch);
	// ページ情報を読み込み
	try {
		// console.log(url);
		const pageJson = await apiPages.getByUrl(fetch, url.pathname);
		if (pageJson.meta.pagination.total > 0) {
			return {
				menuItems,
				pageMeta: {
					title: pageJson.data[0].attributes.title,
					description: pageJson.data[0].attributes.description,
					content: pageJson.data[0].attributes.content
				}
			};
		}
		// console.log(`${url.pathname} is not in pages`);
		const res = await fetch(strapiUrl(url.pathname.slice(1)));
		if (res.ok) {
			const json = await res.json();
			return {
				menuItems,
				pageMeta: {
					title: (json.data?.attributes?.title ?? '') as string,
					description: (json.data?.attributes?.description ?? '') as string,
					content: (json.data?.attributes?.content ?? '') as string
				}
			};
		}
	} catch (err) {
		// console.log(err);
	}

	throw error(500, 'Internal Error @ /LayoutLoad');
}) satisfies LayoutLoad;
