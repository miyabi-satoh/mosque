import type { PageLoad } from './$types';
import { apiUrl } from '$lib/api';
import { apiMimes } from '$lib/api';
import { apiFormats } from '$lib/api';
import type { BlobType } from '$models/interfaces';

interface IResource {
	slug: string | undefined;
	path: string | undefined;
	status: number;
	type: BlobType;
	text: string;
	blobUrl: string;
	mimeType: string;
}

export const load = (async ({ params, fetch, depends }) => {
	// 文書情報を取得する
	const format = await apiFormats.get(fetch, params.id);

	// 実ファイル情報を取得する
	const resources: IResource[] = [];
	format.data.attributes.resources.data.forEach(async (resource) => {
		if (resource.attributes) {
			const blobUrl = apiUrl(`resources/${resource.id}/${resource.attributes.slug}`);
			const res = await fetch(blobUrl);
			const status = res.status;
			const blob = await res.blob();
			let type = 'error';
			let mimeType = '';
			if (res.ok) {
				// ファイルの種類を判定
				const mimes = await apiMimes.getMulti(fetch);
				mimeType = blob.type;
				const found = mimes.data.find((mime) => mimeType.includes(mime.attributes.mime || 'error'));
				if (found) {
					type = found.attributes.type || 'unknown';
				} else {
					type = 'unknown';
				}
			}

			let text = '';
			switch (type) {
				case 'error':
					{
						const lines: string[] = [];
						switch (status) {
							case 404:
								lines.push(`ファイルが存在しません`);
								break;
							case 500:
								lines.push(`ファイルの取得に失敗しました`);
						}
						if (blob) {
							const blobText = await blob.text();
							const json = JSON.parse(blobText);
							lines.push(json.detail);
						}
						text = lines.join('\n');
					}
					break;
				case 'text':
					text = await blob.text();
					break;
				// case 'img':
				// case 'pdf':
				//   break;
			}

			resources.push({
				slug: resource.attributes.slug,
				path: resource.attributes.path,
				status,
				type: type as BlobType,
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
