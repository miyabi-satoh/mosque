import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { normalizeNumber, normalizeSearch } from '$lib/utils';
import { prisma } from '$lib/server/prisma';

const pageSize = 10;

export const load = (async ({ url }) => {
	if (!url.searchParams.get('p')) {
		throw redirect(302, `${url.pathname}?p=1&q=&f=`);
	}

	// console.log('load @ frontend/src/routes/(pages)/links/+page.ts');
	const queryPage = normalizeNumber(url.searchParams.get('p'), 1);
	const querySearch = url.searchParams.get('q') ?? '';
	const queryFor = url.searchParams.get('f') ?? '';

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

	if (queryFor) {
		keywords.push(JSON.parse(`{ "${queryFor}": true }`));
	}

	const where = {
		AND: keywords
	};

	console.log(where);
	const count = await prisma.link.count({
		where
	});
	const links = await prisma.link.findMany({
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
		where
	});

	return {
		queryPage,
		querySearch,
		queryFor,
		links,
		pageSize,
		count
	};
}) satisfies PageServerLoad;
