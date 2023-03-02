import type { Actions, PageServerLoad } from './$types';
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

export const actions: Actions = {
	'upload-user': async ({ request }) => {
		console.log(`upload-user: frontend/src/routes/(pages)/admin/+page.server.ts`);
	}
};
