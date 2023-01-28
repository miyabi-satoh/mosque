import { strapiUrl } from '$lib/utils';
import type { IStrapiPage } from '$models/interfaces';
import type { LayoutLoad } from './$types';

export const load = (async ({ data, url, fetch }) => {
	// ページ情報を読み込み
	let res = await fetch(strapiUrl(`pages?filters[url][$eq]=${url.pathname}`));
	let json = await res.json();
	let page: IStrapiPage;
	if (json.data[0]) {
		page = json.data[0] as IStrapiPage;
	} else {
		res = await fetch(strapiUrl(url.pathname.slice(1)));
		json = await res.json();
		if (json.data && json.data.attributes?.title) {
			page = json.data as IStrapiPage;
		} else {
			// console.log(json);
			throw new Error(`fetch error on ${url.pathname}`);
		}
	}
	// console.log(data);

	const pageInfo = {
		id: page?.id,
		title: page?.attributes?.title,
		description: page?.attributes?.description
	};
	// console.log(pageInfo);

	return {
		...data,
		pageInfo
	};
}) satisfies LayoutLoad;
