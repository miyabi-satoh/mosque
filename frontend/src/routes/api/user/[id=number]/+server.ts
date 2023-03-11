import { error, json } from '@sveltejs/kit';
import { ValidationError } from 'yup';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { userType, type UserUpdate } from '$lib/user';
import { exclude, fromRequest, fromValidationError } from '$lib/utils';
import { updateUser } from '$lib/server/user';

// GET: ユーザーを返す
export const GET = (async ({ params, locals }) => {
	console.log(`GET frontend/src/routes/api/user/[id=number]/+server.ts`);
	if (!locals.user || locals.user.type !== userType.sysadmin) {
		throw error(401, 'アクセス権がありません。');
	}

	const id = Number(params.id);
	const user = await prisma.user.findUnique({
		where: {
			id
		}
	});
	if (user) {
		return json(exclude(user, ['password', 'token']));
	}

	throw error(400, 'ユーザーの取得に失敗しました。');
}) satisfies RequestHandler;

// PUT: ユーザーを更新する
export const PUT: RequestHandler = async ({ locals, params, request }) => {
	console.log(`PUT frontend/src/routes/api/user/[id=number]/+server.ts`);
	if (!locals.user || locals.user.type !== userType.sysadmin) {
		throw error(401, 'アクセス権がありません。');
	}

	const id = Number(params.id);
	const user: UserUpdate = await fromRequest(request);

	try {
		const _user = await updateUser(id, user);
	} catch (err) {
		if (err instanceof ValidationError) {
			const message = `入力データに不備があります。`;
			const errors = fromValidationError(err);
			return json({ message, errors });
		} else if (err instanceof Error) {
			const message = err.message;
			return json({ message });
		}
	}

	return json({ success: true });
};

// DELETE: ユーザーを削除する
export const DELETE: RequestHandler = async ({ locals, params }) => {
	console.log(`DELETE frontend/src/routes/api/user/[id=number]/+server.ts`);
	if (!locals.user || locals.user.type !== userType.sysadmin) {
		throw error(401, 'アクセス権がありません。');
	}

	const id = Number(params.id);
	const user = await prisma.user.delete({
		where: {
			id
		}
	});
	if (user) {
		return json(exclude(user, ['password', 'token']));
	}

	throw error(400, 'ユーザーの削除に失敗しました。');
};
