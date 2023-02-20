import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { typeDetect } from './typeDetect';
import { apiUrl } from '$lib/api';
import type { BlobType } from '$schemas';
import { prisma } from '$lib/server/prisma';

// <object>のonloadを使うため
export const ssr = false;

export const load = (async ({ params, fetch }) => {
	// console.log(`frontend/src/routes/(pages)/resources/[id]/+page.ts`);
	// 文書情報を取得する
	// const resource = await apiResources.get(fetch, params.id);
	const found = await prisma.resource.findUnique({
		where: {
			id: Number(params.id)
		},
		include: {
			resources_assets_links: {
				include: {
					assets: true
				}
			}
		}
	});
	if (!found) {
		throw error(404, 'ご指定のリソースは見つかりませんでした');
	}

	const resource = {
		...found,
		assets: found.resources_assets_links.map((r) => r.assets)
	};

	// 実ファイル情報を取得する
	let resources: object[] = [];
	resource.assets.forEach(async (asset) => {
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

		const resource = {
			data: asset,
			status,
			type,
			text,
			blobUrl,
			mimeType
		};
		resources = [...resources, resource];
	});

	// console.log(`frontend/src/routes/(pages)/resources/[id]/+page.ts ${resources}`);
	return {
		resources
	};
}) satisfies PageLoad;
