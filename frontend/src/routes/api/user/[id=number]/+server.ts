import { error, json } from '@sveltejs/kit';
import { ValidationError } from 'yup';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { isAdminSession } from '$lib/server/session';
import { clearSecret, updateUserSchema, type UserUpdate } from '$lib/user';
import { fromRequest, fromValidationError } from '$lib/utils';
import { existsAbbrev, existsUsername } from '$lib/server/user';
import { encryptPassword } from '$lib/server/passwd';

// GET: ユーザーを返す
export const GET = (async ({ cookies, params }) => {
	console.log(`GET frontend/src/routes/api/user/[id=number]/+server.ts`);
	if (!isAdminSession(cookies)) {
		throw error(401, 'アクセス権がありません。');
	}

	const id = Number(params.id);
	const user = await prisma.user.findUnique({
		where: {
			id
		}
	});
	if (user) {
		return json(clearSecret(user));
	}

	throw error(400, 'ユーザーの取得に失敗しました。');
}) satisfies RequestHandler;

// PUT: ユーザーを更新する
export const PUT: RequestHandler = async ({ cookies, params, request }) => {
	console.log(`PUT frontend/src/routes/api/user/[id=number]/+server.ts`);
	if (!isAdminSession(cookies)) {
		throw error(401, 'アクセス権がありません。');
	}

	const id = Number(params.id);
	const user = await fromRequest<UserUpdate>(request);

	try {
		const validated = await updateUserSchema.validate(user, { abortEarly: false });
		// usernameのユニークチェック
		if (user.username && (await existsUsername(user.username, id))) {
			throw new ValidationError(`ユーザー名が重複しています。`, user.username, 'username');
		}
		// abbrevのユニークチェック
		if (user.abbrev && (await existsAbbrev(user.abbrev, id))) {
			throw new ValidationError(`略称が重複しています。`, user.abbrev, 'abbrev');
		}

		if (validated.password) {
			validated.password = encryptPassword(validated.password);
		}
		const result = await prisma.user.update({
			where: {
				id
			},
			data: {
				...validated,
				email: validated.username ? `${validated.username}@mosque.local` : undefined,
				updatedAt: new Date()
			}
		});

		if (!result) {
			const message = `データベースの更新に失敗しました。`;
			console.log(message);
			// return json({ message });
			throw error(500, message);
		}
	} catch (err) {
		console.log(err);
		const message = `入力データに不備があります。`;
		const errors = fromValidationError(err);
		console.log(errors);
		return json({ message, errors });
	}

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ cookies, params }) => {
	console.log(`DELETE frontend/src/routes/api/user/[id=number]/+server.ts`);
	if (!isAdminSession(cookies)) {
		throw error(401, 'アクセス権がありません。');
	}

	const id = Number(params.id);
	const user = await prisma.user.delete({
		where: {
			id
		}
	});
	if (user) {
		return json(clearSecret(user));
	}

	throw error(400, 'ユーザーの削除に失敗しました。');
};
