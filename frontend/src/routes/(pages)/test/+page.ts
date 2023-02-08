import type { PageLoad } from './$types';
import { apiResources, apiUrl } from '$lib/api';
import type { IStrapiAssetResponse } from '$models/interfaces';

export const load = (async ({ fetch }) => {
	console.log(`frontend/src/routes/(pages)/test/+page.ts`);
	// 文書情報を取得する
	const resource = await apiResources.get(fetch, 1);

	// 実ファイル情報を取得する
	let assets: IStrapiAssetResponse['data'][] = [];
	for (const asset of resource.data.attributes.assets.data) {
		const blobUrl = apiUrl(`assets/${asset.id}/${asset.attributes.slug}`);
		const res = await fetch(blobUrl);
		console.log(res);

		assets = [...assets, asset];
	}
	// 再読み込み可能にする
	// depends('app:resources');

	return {
		assets
	};
}) satisfies PageLoad;
