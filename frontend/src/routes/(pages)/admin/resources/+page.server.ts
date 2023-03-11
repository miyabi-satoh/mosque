import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
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
				kwyword: { contains: term, mode: 'insensitive' }
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

export const actions = {
	// remove: async ({ request }) => {
	// 	const data = await request.formData();
	// 	const id = data.get('id');
	// 	const deleteUser = await prisma.user.delete({
	// 		where: {
	// 			id: Number(id)
	// 		}
	// 	});
	// 	if (deleteUser) {
	// 		return {
	// 			deleteUser: clearSecret(deleteUser)
	// 		};
	// 	}
	// 	return fail(400, {
	// 		deleteUser: null
	// 	});
	// },
	upload: async ({ request }) => {
		const data = await request.formData();
		const body = data.get('body');

		console.log(body);
	}
} satisfies Actions;
