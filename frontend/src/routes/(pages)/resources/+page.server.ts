import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { normalizeNumber, normalizeSearch } from '$lib/utils';

const pageSize = 12;

export const load = (async ({ url }) => {
	console.log(`/routes/(pages)/resources/+page.server.ts`);
	if (!url.searchParams.get('p')) {
		throw redirect(302, `${url.pathname}?p=1&q=`);
	}

	const queryPage = normalizeNumber(url.searchParams.get('p'), 1);
	const querySearch = url.searchParams.get('q') ?? '';

	const keywords: object[] = [];
	normalizeSearch(decodeURIComponent(querySearch))
		.split(' ')
		.filter((term) => term)
		.forEach((term) => {
			keywords.push({
				keyword: {
					contains: term,
					mode: 'insensitive'
				}
			});
		});

	const where = {
		AND: keywords
	};
	console.log(where);
	const count = await prisma.resource.count({ where });
	const rows = await prisma.resource.findMany({
		skip: (queryPage - 1) * pageSize,
		take: pageSize,
		orderBy: [
			{
				count: 'desc'
			},
			{
				updatedAt: 'desc'
			}
		],
		where,
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

	const resources = rows.map((row) => {
		return {
			...row,
			assets: row.resources_assets_links.map((r) => r.assets)
		};
	});

	return {
		queryPage,
		querySearch,
		resources,
		pageSize,
		count
	};
}) satisfies PageServerLoad;
