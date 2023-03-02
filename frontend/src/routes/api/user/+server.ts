import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { isAdminSession } from '$lib/server/session';
import { clearSecret } from '$lib/user';

// frontend/src/routes/api/user/+server.ts
export const GET = (async ({ url, cookies }) => {
	console.log(`GET frontend/src/routes/api/user/+server.ts`);
	if (!isAdminSession(cookies)) {
		throw error(401, 'アクセス権がありません。');
	}

	const filter = url.searchParams.get('filter') ?? '';
	const objFilter = filter ? JSON.parse(decodeURIComponent(filter)) : {};
	// console.log(objFilter);
	const users = await prisma.user.findMany(objFilter);
	if (users) {
		return json(users.map((user) => clearSecret(user)));
	}

	throw error(400, 'ユーザー一覧の取得に失敗しました。');
}) satisfies RequestHandler;
