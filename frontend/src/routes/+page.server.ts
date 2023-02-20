import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async () => {
	const latestInfo = await prisma.info.findFirst({
		orderBy: {
			updated_at: 'desc'
		}
	});

	return {
		latestInfo
	};
}) satisfies PageServerLoad;
