import { strapiUrl } from '$lib/utils';
import type { IPage, IStrapiPage } from '$models/interfaces';
import type { LayoutLoad } from './$types';

export const load = (async ({ url, fetch }) => {
	let menuItems = [] as IPage[];
	// サイドメニューの項目を読み込み
	let res = await fetch(strapiUrl(`pages?filters[is_menuitem][$eq]=true&sort=order:desc`));
	if (res.ok) {
		const json = await res.json();
		menuItems = json.data.map((data: IStrapiPage) => {
			return {
				id: data?.id,
				url: data?.attributes?.url,
				title: data?.attributes?.title,
				description: data?.attributes?.description
			};
		});
	}

	let page: IStrapiPage = undefined;
	// ページ情報を読み込み
	res = await fetch(strapiUrl(`pages?filters[url][$eq]=${url.pathname}`));
	if (res.ok) {
		const json = await res.json();
		if (json.data[0]) {
			page = json.data[0] as IStrapiPage;
		}
	}

	if (page === undefined) {
		res = await fetch(strapiUrl(url.pathname.slice(1)));
		if (res.ok) {
			const json = await res.json();
			if (json.data && json.data.attributes?.title) {
				page = json.data as IStrapiPage;
			}
		}
	}

	const pageInfo = {
		id: page?.id,
		title: page?.attributes?.title,
		description: page?.attributes?.description
	} as IPage;

	return {
		menuItems,
		pageInfo
	};
}) satisfies LayoutLoad;
