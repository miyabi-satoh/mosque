import type { PageLoad } from './$types';
import { typeDetect } from './typeDetect';
import { apiResources, apiUrl } from '$lib/api';
import type { BlobType, IStrapiAssetResponse } from '$models/interfaces';

type IResource = {
	data: IStrapiAssetResponse['data'];
	status: number;
	type: BlobType;
	text: string;
	blobUrl: string;
	// blob: Blob;
	mimeType: string;
};

export const load = (async ({ params, fetch, depends }) => {
	console.log(`frontend/src/routes/(pages)/resources/[id]/+page.ts`);
	// 文書情報を取得する
	const resource = await apiResources.get(fetch, params.id);

	// 実ファイル情報を取得する
	let resources: IResource[] = [];
	for (const asset of resource.data.attributes.assets.data) {
		let type: BlobType = 'error';
		let mimeType = '';
		let text = '';
		// let blobUrl = asset.attributes.uri;
		// let res;
		// if (blobUrl.startsWith('http')) {
		// 	res = await fetch(blobUrl, {
		// 		mode: 'no-cors'
		// 	});
		// } else {
		const blobUrl = apiUrl(`assets/${asset.id}/${asset.attributes.slug}`);
		const res = await fetch(blobUrl);
		// }
		const status = res.status;
		const blob = await res.blob();
		if (res.ok) {
			// ファイルの種類を判定
			mimeType = blob.type;
			type = typeDetect(blob.type);
			if (type == 'text') {
				text = await blob.text();
			}
		} else {
			type = 'error';
			const lines: string[] = [];
			switch (status) {
				case 404:
					lines.push(`ファイルが存在しません`);
					break;
				case 500:
					lines.push(`ファイルの取得に失敗しました`);
					break;
			}
			if (blob) {
				const blobText = await blob.text();
				try {
					const json = JSON.parse(blobText);
					if (json.detail) {
						lines.push(json.detail);
					}
				} catch (err) {
					console.log(err);
				}
			}
			text = lines.join('\n');
		}

		const resource = {
			data: asset,
			status,
			type,
			text,
			blobUrl,
			// blob,
			mimeType
		};
		// console.log(resource);
		resources = [...resources, resource];
	}
	// 再読み込み可能にする
	depends('app:resources');

	console.log(`frontend/src/routes/(pages)/resources/[id]/+page.ts ${resources}`);
	return {
		resources: resources
	};
}) satisfies PageLoad;
