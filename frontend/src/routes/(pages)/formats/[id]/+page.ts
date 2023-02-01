import { apiUrl, strapiUrl } from '$lib/utils';
import type { BlobType, IStrapiFormat, IStrapiMime } from '$models/interfaces';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

interface IResource {
	slug: string | undefined;
	path: string | undefined;
	status: number;
	type: BlobType;
	text: string;
	blobUrl: string;
	mimeType: string;
}
// interface IPageLoadData {
// 	format: IStrapiFormat;
// 	resources: IResource[];
// }

export const load = (async ({ params, fetch, depends }) => {
	// 文書情報を取得する
	let res = await fetch(strapiUrl(`formats/${params.id}?populate=*`));
	if (!res.ok) {
		console.log('Strapi server is down?');
		throw error(404, '404 Not Found');
	}
	let json = await res.json();
	if (json.error) {
		console.log(`Format data is not found`);
		throw error(404, '404 Not Found');
	}
	const format = json.data as IStrapiFormat;

	// 実ファイル情報を取得する
	const resources: IResource[] = [];
	if (format?.attributes?.resources?.data) {
		format.attributes.resources.data.forEach(async (resource) => {
			if (resource.attributes) {
				const blobUrl = apiUrl(`formats/${params.id}/${resource.attributes.slug}`);
				res = await fetch(blobUrl);
				let status = res.status;
				let blob = await res.blob();
				let type = 'error';
				let mimeType = '';
				if (res.ok) {
					// ファイルの種類を判定
					res = await fetch(strapiUrl('mimes'));
					if (!res.ok) {
						const json = await res.json();
						const errObj = {
							detail: json.error.message
						};
						status = json.error.status;
						blob = new Blob([JSON.stringify(errObj)], { type: 'text/plain' });
					} else {
						json = await res.json();
						mimeType = blob.type;
						const found = json.data.find((mime: IStrapiMime) =>
							mimeType.includes(mime?.attributes?.mime || 'error')
						) as IStrapiMime;
						if (found) {
							type = found.attributes?.type || 'unknown';
						} else {
							('unknown');
						}
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
	}
	// 再読み込み可能にする
	depends('app:formats');

	return {
		format,
		resources
	};
}) satisfies PageLoad;
