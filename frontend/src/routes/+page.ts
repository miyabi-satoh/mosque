import { strapiUrl } from '$lib/utils';
import type { IPage, IStrapiPage } from '$models/interfaces';
import type { PageLoad } from './$types';

export const load = (async ({ url, fetch }) => {
	let page: IStrapiPage = undefined;
	// ページ情報を読み込み
	let res = await fetch(strapiUrl(`pages?filters[url][$eq]=${url.pathname}`));
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
		pageInfo
	};
}) satisfies PageLoad;
