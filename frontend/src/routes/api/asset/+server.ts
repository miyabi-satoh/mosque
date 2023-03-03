import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { isAdminSession } from '$lib/server/session';

export const GET = (async ({ url, cookies }) => {
	console.log(`GET frontend/src/routes/api/asset/+server.ts`);
	if (!isAdminSession(cookies)) {
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
