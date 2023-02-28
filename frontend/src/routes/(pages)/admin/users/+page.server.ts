import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { normalizeNumber } from '$lib/utils';

const pageSize = 12;
export const load = (async ({ url }) => {
	console.log(`frontend/src/routes/(pages)/admin/users/+page.server.ts`);

	if (!url.searchParams.get('p')) {
		throw redirect(302, `${url.pathname}?p=1&q=`);
	}

	// console.log(`load @ frontend/src/routes/(pages)/resources/+page.ts`);
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
				OR: [
					{ username: { contains: term, mode: 'insensitive' } },
					{ sei: { contains: term, mode: 'insensitive' } },
					{ mei: { contains: term, mode: 'insensitive' } },
					{ seiKana: { contains: term, mode: 'insensitive' } },
					{ meiKana: { contains: term, mode: 'insensitive' } },
					{ displayName: { contains: term, mode: 'insensitive' } },
					{ abbrev: { contains: term, mode: 'insensitive' } }
				]
			});
		});

	const where = {
		AND: keywords
	};
	console.log(where);
	const count = await prisma.user.count({ where });
	const users = await prisma.user.findMany({
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
		users,
		pageSize,
		count
	};
}) satisfies PageServerLoad;

export const actions = {
	remove: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const deleteUser = await prisma.user.delete({
			where: {
				id: Number(id)
			}
		});
		if (deleteUser) {
			deleteUser.password = '';
			return {
				deleteUser
			};
		}
		return fail(400, {
			deleteUser: null
		});
	}
} satisfies Actions;
