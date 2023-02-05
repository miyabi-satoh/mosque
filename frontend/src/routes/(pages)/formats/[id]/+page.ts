import type { PageLoad } from './$types';
import { typeDetect } from './typeDetect';
import { apiUrl } from '$lib/api';
import { apiFormats } from '$lib/api';
import type { BlobType, IStrapiResourceResponse } from '$models/interfaces';

type IResource = {
	data: IStrapiResourceResponse['data'];
	status: number;
	type: BlobType;
	text: string;
	blobUrl: string;
	mimeType: string;
};

export const load = (async ({ params, fetch, depends }) => {
	// 文書情報を取得する
	const format = await apiFormats.get(fetch, params.id);

	// 実ファイル情報を取得する
	const resources: IResource[] = [];
	format.data.attributes.resources.data.forEach(async (resource) => {
		if (resource.attributes) {
			let type: BlobType = 'error';
			let mimeType = '';
			let text = '';
			const blobUrl = apiUrl(`resources/${resource.id}/${resource.attributes.slug}`);
			const res = await fetch(blobUrl);
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
					const json = JSON.parse(blobText);
					lines.push(json.detail);
				}
				text = lines.join('\n');
			}

			resources.push({
				data: resource,
				status,
				type,
				text,
				blobUrl,
				mimeType
			});
		}
	});
	// 再読み込み可能にする
	depends('app:formats');

	return {
		// format,
		resources
	};
}) satisfies PageLoad;
