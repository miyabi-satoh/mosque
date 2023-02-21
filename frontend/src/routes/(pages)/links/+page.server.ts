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

	let keywords = {};
	normalizeSearch(querySearch)
		.split(' ')
		.filter((term) => term)
		.forEach((term) => {
			keywords = {
				...keywords,
				keyword: {
					contains: term,
					mode: 'insensitive'
				}
			};
		});

	const whereFor: Record<string, boolean> = {};
	if (queryFor) {
		whereFor[queryFor] = true;
	}

	const where = {
		...whereFor,
		...keywords
	};

	const count = await prisma.link.count(where);
	const links = await prisma.link.findMany({
		skip: (queryPage - 1) * pageSize,
		take: pageSize,
		orderBy: {
			order: 'desc'
		},
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
