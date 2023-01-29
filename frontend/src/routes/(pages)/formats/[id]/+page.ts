import { apiUrl, strapiUrl } from '$lib/utils';
import type { IFormat, IStrapiFormat } from '$models/interfaces';
import type { PageLoad } from './$types';

interface IPageLoadResult {
	format: IFormat;
	status: number;
	blob: Blob;
}

export const load = (async ({ params, fetch, depends }) => {
	let retObj = {};
	let res = await fetch(strapiUrl(`formats/${params.id}`));
	const json = await res.json();
	// console.log(json);
	if (json.error) {
		throw new Error(json.error.message);
	}

	const data = json.data as IStrapiFormat;
	const format = {
		id: data?.id,
		title: data?.attributes?.title,
		description: data?.attributes?.description,
		realPath: data?.attributes?.realPath
	} as IFormat;
	retObj = { ...retObj, format };

	// let text = undefined;
	// const blob = undefined;

	res = await fetch(apiUrl(`formats/${params.id}`));
	const status = res.status;
	retObj = { ...retObj, status };
	const blob = await res.blob();
	retObj = { ...retObj, blob };
	// for (const [key, value] of res.headers) {
	// 	console.log(`${key} = ${value}`);
	// }
	// const contentType = res.headers.get('Content-Type');
	// if (contentType?.includes('text/plain') || contentType?.includes('application/json')) {
	// 	text = await res.text();
	// } else if (contentType) {
	// 	console.log(contentType);
	// 	text = contentType;
	// }

	depends('app:formats');
	return retObj as IPageLoadResult;
}) satisfies PageLoad;
