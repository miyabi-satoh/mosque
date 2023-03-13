import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { filterWords, normalizeNumber } from '$lib/utils';
import { prisma } from '$lib/server/prisma';

const pageSize = 12;

export const load = (async ({ url }) => {
	console.log(`/routes/(pages)/links/+page.server.ts`);
	if (!url.searchParams.get('p')) {
		throw redirect(302, `${url.pathname}?p=1&q=&f=`);
	}

	const queryPage = normalizeNumber(url.searchParams.get('p'), 1);
	const querySearch = url.searchParams.get('q') ?? '';
	const queryFor = url.searchParams.get('f') ?? '';

	const keywords = filterWords(decodeURIComponent(querySearch)).map((keyword) => {
		return {
			keyword
		};
	});
	// const keywords: object[] = [];
	// normalizeSearch(decodeURIComponent(querySearch))
	// 	.split(' ')
	// 	.filter((term) => term)
	// 	.forEach((term) => {
	// 		keywords.push({
	// 			keyword: {
	// 				contains: term,
	// 				mode: 'insensitive'
	// 			}
	// 		});
	// 	});

	if (queryFor) {
		keywords.push(JSON.parse(`{ "${queryFor}": true }`));
	}

	const where = {
		AND: keywords
	};

	const count = await prisma.link.count({
		where: where as never
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
		where: where as never
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
