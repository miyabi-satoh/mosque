import type { LayoutLoad } from './$types';
import { apiPages, strapiUrl } from '$lib/api';
import type { IPageMeta, IStrapiPage } from '$models/interfaces';

interface ILayoutLoadData {
	menuItems: IStrapiPage[];
	pageMeta: IPageMeta;
}
export const load = (async ({ url, fetch }): Promise<ILayoutLoadData> => {
	// サイドメニューの項目を読み込み
	const menuItems = await apiPages.getMenuItems(fetch);
	// ページ情報を読み込み
	try {
		const data = await apiPages.getByUrl(fetch, url.pathname);
		return {
			menuItems,
			pageMeta: {
				title: data.attributes.title,
				description: data.attributes.description,
				content: data.attributes.content
			}
		};
	} catch (err) {
		const res = await fetch(strapiUrl(url.pathname.slice(1)));
		if (res.ok) {
			const json = await res.json();
			if (json.data?.attributes)
				return {
					menuItems,
					pageMeta: {
						title: json.data.attributes.title,
						description: json.data.attributes.description
					}
				};
		}
	}

	throw new Error('LayoutLoad Error');
}) satisfies LayoutLoad;
