import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { createUserSchema, updateUserSchema, type UserUpdate } from '$lib/user';
import { fromRequest, fromValidationError } from '$lib/utils';
import { comparePassword, encryptPassword } from '$lib/server/passwd';

export const load = (async () => {
	console.log(`frontend/src/routes/(pages)/admin/+page.server.ts`);

	const pages = await prisma.page.findMany({
		where: {
			url: {
				startsWith: `/admin/`
			}
		},
		orderBy: {
			order: 'desc'
		}
	});

	return {
		pages
	};
}) satisfies PageServerLoad;

type FormData = {
	json: string;
};
type ValidationError = {
	[key in keyof UserUpdate]?: string;
};
type ActionResponse = {
	success?: boolean;
	id?: number;
	errors?: ValidationError;
	user?: UserUpdate;
	message: string;
};

export const actions: Actions = {
	default: async ({ request }) => {
		console.log(`upload-user: frontend/src/routes/(pages)/admin/+page.server.ts`);
		const success = true;
		const formData = await fromRequest<FormData>(request);
		const users = JSON.parse(formData.json) as UserUpdate[];
		let progress = 0;
		let upserted = 0;
		for (const user of users) {
			progress++;

			let values = { ...user };
			if (user.id) {
				const userInDB = await prisma.user.findUnique({
					where: {
						id: user.id
					}
				});
				if (userInDB) {
					// データが一致するなら更新不要
					if (
						!(Object.keys(user) as (keyof UserUpdate)[]).find(
							(key) => key !== 'password' && user[key] && user[key] !== userInDB[key]
						) &&
						(!user.password || comparePassword(user.password, userInDB.password))
					) {
						console.log(`${user.id}: 更新の必要なし`);
						continue;
					}

					values = {
						...userInDB,
						...user
					};
				}
			}
			if (!user.password) {
				values.password = undefined;
			}

			// 値のバリデーション
			try {
				const schema = user.id ? updateUserSchema : createUserSchema;
				const validated = await schema.validate(values, { abortEarly: false });
				// usernameのユニークチェック
				if (await existsUsername(user.id, user.username)) {
					const message = `${user.username}: ユーザー名が重複しています。`;
					console.log(message);
					return fail(400, { message } as ActionResponse);
				}
				// abbrevのユニークチェック
				if (await existsAbbrev(user.id, user.abbrev)) {
					const message = `${user.abbrev}: 略称が重複しています。`;
					console.log(message);
					return fail(400, { message } as ActionResponse);
				}

				validated.password = encryptPassword(validated.password);
				const result = await prisma.user.upsert({
					where: {
						id: user.id ?? 0
					},
					update: {
						...validated,
						updatedAt: new Date()
					},
					create: {
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
					return fail(500, { message } as ActionResponse);
				}
			} catch (err) {
				console.log(err);
				const message = `${progress}件目の入力データに不備があります。`;
				const errors = fromValidationError(err);
				console.log(errors);
				const data: ActionResponse = { message, errors, user };
				console.log(data);
				return fail(400, data);
			}
			upserted++;
		}

		const message = `インポートしたデータは${upserted}件です。`;
		return { success, message } as ActionResponse;
	}
};

const existsUsername = async (id: number | undefined, username: string | null | undefined) => {
	if (!username) {
		return false;
	}

	const whereId = id ? { id: { not: id } } : {};
	const ret = await prisma.user.findFirst({
		where: {
			...whereId,
			username
		}
	});
	return !!ret;
};

const existsAbbrev = async (id: number | undefined, abbrev: string | null | undefined) => {
	if (!abbrev) {
		return false;
	}

	const whereId = id ? { id: { not: id } } : {};
	const ret = await prisma.user.findFirst({
		where: {
			...whereId,
			abbrev
		}
	});
	return !!ret;
};
