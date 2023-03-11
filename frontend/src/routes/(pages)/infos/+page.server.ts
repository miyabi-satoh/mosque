import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { normalizeNumber } from '$lib/utils';
import { prisma } from '$lib/server/prisma';

const pageSize = 12;

export const load = (async ({ url }) => {
	console.log(`/routes/(pages)/infos/+page.server.ts`);
	if (!url.searchParams.get('p')) {
		throw redirect(302, `${url.pathname}?p=1&q=`);
	}

	const queryPage = normalizeNumber(url.searchParams.get('p'), 1);
	const querySearch = url.searchParams.get('q') ?? '';

	let where = {};
	decodeURIComponent(querySearch)
		.replaceAll('　', ' ')
		.replace(/ +/g, ' ')
		.split(' ')
		.filter((term) => term)
		.forEach((term) => {
			where = {
				...where,
				OR: [
					{
						title: {
							contains: term,
							mode: 'insensitive'
						}
					},
					{
						text: {
							contains: term,
							mode: 'insensitive'
						}
					}
				]
			};
		});

	const count = await prisma.info.count(where);
	const infos = await prisma.info.findMany({
		skip: (queryPage - 1) * pageSize,
		take: pageSize,
		orderBy: {
			updatedAt: 'desc'
		},
		where
	});

	return {
		queryPage,
		querySearch,
		infos,
		pageSize,
		count
	};
}) satisfies PageServerLoad;
