import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ params }) => {
	const info = await prisma.info.findUnique({
		where: {
			id: Number(params.id)
		}
	});
	if (!info) {
		throw error(404, 'ご指定の情報は見つかりませんでした');
	}

	return {
		info
	};
}) satisfies PageServerLoad;
