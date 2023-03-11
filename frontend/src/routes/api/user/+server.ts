import { error, json } from '@sveltejs/kit';
import { ValidationError } from 'yup';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { userType, type UserCreate } from '$lib/user';
import { exclude, requestToObject, validationErrorToAssoc } from '$lib/utils';
import { createUser } from '$lib/server/user';

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

// POST: ユーザーを作成する
export const POST: RequestHandler = async ({ locals, request }) => {
	console.log(`POST /routes/api/user/+server.ts`);
	if (!locals.user || locals.user.type !== userType.sysadmin) {
		throw error(401, 'アクセス権がありません。');
	}

	const user = await requestToObject<UserCreate>(request);

	try {
		const _user = await createUser(user);
	} catch (err) {
		if (err instanceof ValidationError) {
			const message = `入力データに不備があります。`;
			const errors = validationErrorToAssoc(err);
			return json({ message, errors });
		} else if (err instanceof Error) {
			const message = err.message;
			return json({ message });
		}
	}

	return json({ success: true });
};
