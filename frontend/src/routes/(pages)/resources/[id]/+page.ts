import type { Asset } from '@prisma/client';
import type { PageLoad } from './$types';
import { typeDetect } from './typeDetect';
import { apiUrl } from '$lib/api';
import type { BlobType } from '$schemas';

type AssetData = Asset & {
	status: number;
	type: BlobType;
	text: string;
	blobUrl: string;
	mimeType: string;
};
// <object>のonloadを使うため
export const ssr = false;

export const load = (async ({ data, fetch }) => {
	// console.log(`frontend/src/routes/(pages)/resources/[id]/+page.ts`);

	// 実ファイル情報を取得する
	let assets: AssetData[] = [];
	data.assets.forEach(async (asset) => {
		let type: BlobType = 'error';
		let mimeType = '';
		let text = '';
		const blobUrl = apiUrl(`assets/${asset?.id}/${asset?.slug}`);
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
					// console.log(err);
				}
			}
			text = lines.join('\n');
		}

		assets = [
			...assets,
			{
				...asset,
				status,
				type,
				text,
				blobUrl,
				mimeType
			} as never
		];
	});

	// console.log(`frontend/src/routes/(pages)/resources/[id]/+page.ts ${resources}`);
	return {
		...data,
		assets
	};
}) satisfies PageLoad;
