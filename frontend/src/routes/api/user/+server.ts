import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { userType } from '$lib/user';
import { exclude } from '$lib/utils';

// GET: ユーザーリストを返す
export const GET = (async ({ url, locals }) => {
	console.log(`GET /routes/api/user/+server.ts`);
	if (!locals.user || locals.user.type !== userType.sysadmin) {
		throw error(401, 'アクセス権がありません。');
	}

	const filter = url.searchParams.get('filter') ?? '';
	const objFilter = filter ? JSON.parse(decodeURIComponent(filter)) : {};
	const users = await prisma.user.findMany(objFilter);
	if (users) {
		return json(users.map((user) => exclude(user, ['password', 'token'])));
	}

	throw error(400, 'ユーザーリストの取得に失敗しました。');
}) satisfies RequestHandler;
