import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET = (async ({ params }) => {
	const where = {
		where: {
			id: Number(params.id)
		}
	};
	const link = await prisma.link.findUnique({
		...where
	});
	if (link) {
		const newCount = (link.count ?? 0) + 1;
		await prisma.link.update({
			...where,
			data: {
				count: newCount
			}
		});
		return json({ success: true });
	}

	return json({ success: false });
}) satisfies RequestHandler;
