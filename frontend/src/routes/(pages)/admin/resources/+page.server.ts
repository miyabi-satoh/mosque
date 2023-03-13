import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { normalizeNumber } from '$lib/utils';

const pageSize = 10;
export const load = (async ({ url }) => {
	console.log(`/routes/(pages)/admin/resources/+page.server.ts`);

	if (!url.searchParams.get('p')) {
		throw redirect(302, `${url.pathname}?p=1&q=`);
	}

	const queryPage = normalizeNumber(url.searchParams.get('p'), 1);
	const querySearch = url.searchParams.get('q') ?? '';

	const keywords: object[] = [];
	decodeURIComponent(querySearch)
		.replaceAll('　', ' ')
		.replace(/ +/g, ' ')
		.split(' ')
		.filter((term) => term)
		.forEach((term) => {
			keywords.push({
				keyword: { contains: term, mode: 'insensitive' }
			});
		});

	const where = {
		AND: keywords
	};
	console.log(where);
	const count = await prisma.resource.count({ where });
	const resources = await prisma.resource.findMany({
		skip: (queryPage - 1) * pageSize,
		take: pageSize,
		orderBy: [
			{
				id: 'asc'
			}
		],
		where
	});

	return {
		queryPage,
		querySearch,
		resources,
		pageSize,
		count
	};
}) satisfies PageServerLoad;
