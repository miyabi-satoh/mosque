import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET = (async () => {
	const assets = await prisma.asset.findMany();
	if (assets) {
		return json({ assets });
		// return json({
		// 	assets: assets.filter((asset) => {
		// 		if (!asset.cache) {
		// 			return true;
		// 		}
		// 		if (!fs.existsSync(asset.cache)) {
		// 			return true;
		// 		}
		// 		return false;
		// 	})
		// });
	}
	throw error(404, 'Not Found');
}) satisfies RequestHandler;
