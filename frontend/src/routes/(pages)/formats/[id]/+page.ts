import { apiUrl, strapiUrl } from '$lib/utils';
import type { BlobType, IFormat, IStrapiFormat, IStrapiMime } from '$models/interfaces';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

interface IPageLoadData {
	format: IFormat | undefined;
	status: number;
	blob: Blob | undefined;
	type: BlobType;
}

export const load = (async ({ params, fetch, depends }) => {
	let retObj = {} as IPageLoadData;
	retObj = { ...retObj, type: 'error' };

	// 文書情報を取得する
	let res = await fetch(strapiUrl(`formats/${params.id}`));
	if (!res.ok) {
		console.log('Strapi server is down?');
		throw error(404, 'Not Found');
	}
	let json = await res.json();
	if (json.error) {
		console.log(`Format data is not found`);
		throw error(404, '404 Not Found');
	}
	const data = json.data as IStrapiFormat;
	const format = {
		id: data?.id,
		title: data?.attributes?.title,
		description: data?.attributes?.description,
		realPath: data?.attributes?.realPath
	} as IFormat;
	retObj = { ...retObj, format };

	// 実ファイル情報を取得する
	res = await fetch(apiUrl(`formats/${params.id}/${format.title}`));
	if (!res.ok) {
		console.log('FastAPI server is down?');
		retObj = { ...retObj, status: 500 };
	} else {
		const status = res.status;
		const blob = await res.blob();
		retObj = { ...retObj, status, blob };
		// ファイルの種類を判定
		res = await fetch(strapiUrl('mimes'));
		if (!res.ok) {
			console.log('Strapi server is down?');
			retObj = { ...retObj, type: 'unknown' };
		} else {
			json = await res.json();
			const found = json.data.find((mime: IStrapiMime) =>
				blob.type.includes(mime?.attributes?.mime || 'error')
			) as IStrapiMime;
			if (found) {
				retObj = { ...retObj, type: found.attributes?.type as BlobType };
			} else {
				retObj = { ...retObj, type: 'unknown' };
			}
		}
	}

	// 再読み込み可能にする
	depends('app:formats');

	return retObj;
}) satisfies PageLoad;
