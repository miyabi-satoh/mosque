import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { isAdminSession } from '$lib/server/session';
import { clearSecret, createUserSchema, type UserCreate } from '$lib/user';
import { fromRequest, fromValidationError } from '$lib/utils';
import { existsAbbrev, existsUsername } from '$lib/server/user';
import { encryptPassword } from '$lib/server/passwd';

// GET: ユーザーリストを返す
export const GET = (async ({ url, cookies }) => {
	console.log(`GET frontend/src/routes/api/user/+server.ts`);
	if (!isAdminSession(cookies)) {
		throw error(401, 'アクセス権がありません。');
	}

	const filter = url.searchParams.get('filter') ?? '';
	const objFilter = filter ? JSON.parse(decodeURIComponent(filter)) : {};
	const users = await prisma.user.findMany(objFilter);
	if (users) {
		return json(users.map((user) => clearSecret(user)));
	}

	throw error(400, 'ユーザーリストの取得に失敗しました。');
}) satisfies RequestHandler;

// POST: ユーザーを作成する
export const POST: RequestHandler = async ({ cookies, request }) => {
	console.log(`POST frontend/src/routes/api/user/+server.ts`);
	if (!isAdminSession(cookies)) {
		throw error(401, 'アクセス権がありません。');
	}

	const user = await fromRequest<UserCreate>(request);

	try {
		const validated = await createUserSchema.validate(user, { abortEarly: false });
		// usernameのユニークチェック
		if (await existsUsername(user.username)) {
			const message = `${user.username}: ユーザー名が重複しています。`;
			console.log(message);
			return json({ message });
		}
		// abbrevのユニークチェック
		if (await existsAbbrev(user.abbrev)) {
			const message = `${user.abbrev}: 略称が重複しています。`;
			console.log(message);
			return json({ message });
		}

		validated.password = encryptPassword(validated.password);
		const result = await prisma.user.create({
			data: {
				...validated,
				email: `${validated.username}@mosque.local`,
				provider: 'local',
				confirmed: true,
				createdAt: new Date(),
				updatedAt: new Date(),
				created_by_id: 1,
				updated_by_id: 1
			}
		});

		if (!result) {
			const message = `データベースの更新に失敗しました。`;
			console.log(message);
			return json({ message });
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
