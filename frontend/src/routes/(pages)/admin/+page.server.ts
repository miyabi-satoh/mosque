import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUser } from '$lib/server/session';
import { prisma } from '$lib/server/prisma';

// frontend/src/routes/admin/+page.server.ts
export const load = (async ({ cookies }) => {
	const user = await getUser(cookies);
	if (!user || user.id != 1) {
		throw error(404, 'Not Found');
	}

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
