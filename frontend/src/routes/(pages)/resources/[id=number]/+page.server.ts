import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ url, params, parent }) => {
	// console.log(`frontend/src/routes/(pages)/resources/[id]/+page.ts`);
	// 文書情報を取得する
	// const resource = await apiResources.get(fetch, params.id);
	const resource = await prisma.resource.findUnique({
		where: {
			id: Number(params.id)
		},
		include: {
			resources_assets_links: {
				orderBy: {
					asset_order: 'asc'
				},
				include: {
					assets: true
				}
			}
		}
	});
	if (!resource) {
		throw error(404, 'ご指定のリソースは見つかりませんでした');
	}

	const assets = resource.resources_assets_links.map((r) => r.assets);
	const parentData = await parent();
	// console.log(`frontend/src/routes/(pages)/resources/[id]/+page.ts ${resources}`);
	return {
		resource,
		assets,
		breadcrumbParams: [
			...parentData.breadcrumbParams,
			{
				href: url.pathname,
				name: resource.title ?? ''
			}
		],
		pageMeta: {
			title: resource.title,
			description: resource.description
		}
	};
}) satisfies PageServerLoad;
