import { apiUrl, strapiUrl } from '$lib/utils';
import type { IFormat, IStrapiFormat } from '$models/interfaces';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

interface IPageLoadData {
	format: IFormat | undefined;
	status: number;
	blob: Blob | undefined;
}

export const load = (async ({ params, fetch, depends }) => {
	let retObj = {};

	// 文書情報を取得する
	let res = await fetch(strapiUrl(`formats/${params.id}`));
	const json = await res.json();
	if (json.error) {
		console.log(`Let's throw error`);
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
	res = await fetch(apiUrl(`formats/${params.id}`));
	const status = res.status;
	const blob = await res.blob();
	retObj = { ...retObj, status, blob };

	// 再読み込み可能にする
	depends('app:formats');

	return retObj as IPageLoadData;
}) satisfies PageLoad;
