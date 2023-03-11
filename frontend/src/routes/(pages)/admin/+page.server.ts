import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async () => {
	console.log(`frontend/src/routes/(pages)/admin/+page.server.ts`);

	const pages = await prisma.page.findMany({
		where: {
			url: {
				startsWith: `/admin/`
			}
		},
		orderBy: {
			order: 'desc'
		}
	});

	return {
		pages
	};
}) satisfies PageServerLoad;
