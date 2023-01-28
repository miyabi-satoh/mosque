import { strapiUrl } from '$lib/utils';
import type { IPage, IStrapiPage } from '$models/interfaces';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	// サイドメニューの項目を読み込み
	const res = await fetch(strapiUrl(`pages?filters[is_menuitem][$eq]=true&sort=order:desc`));
	const json = await res.json();
	// console.log(json.data);
	const menuItems: IPage[] = json.data.map((data: IStrapiPage) => {
		return {
			id: data?.id,
			url: data?.attributes?.url,
			title: data?.attributes?.title,
			description: data?.attributes?.description
		} as IPage;
	});
	// console.log(menuItems);

	return {
		menuItems
	};
}) satisfies LayoutServerLoad;
