import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET = (async ({ params }) => {
	const where = {
		where: {
			id: Number(params.id)
		}
	};
	const resource = await prisma.resource.findUnique({
		...where
	});
	if (resource) {
		const newCount = (resource.count ?? 0) + 1;
		await prisma.resource.update({
			...where,
			data: {
				count: newCount
			}
		});
		return json({ success: true });
	}

	return json({ success: false });
}) satisfies RequestHandler;
