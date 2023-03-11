import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { userType } from '$lib/user';

export const GET = (async ({ url, locals }) => {
	console.log(`GET frontend/src/routes/api/asset/+server.ts`);
	if (!locals.user || locals.user.type !== userType.sysadmin) {
		throw error(401, 'アクセス権がありません。');
	}

	const filter = url.searchParams.get('filter') ?? '';
	const objFilter = filter ? JSON.parse(filter) : {};
	const assets = await prisma.asset.findMany(objFilter);
	if (assets) {
		return json(assets);
	}
	throw error(404, 'アセットリストの取得に失敗しました');
}) satisfies RequestHandler;
