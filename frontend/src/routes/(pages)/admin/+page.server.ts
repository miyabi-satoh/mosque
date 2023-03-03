import { fail } from '@sveltejs/kit';
import { boolean, number, object, string } from 'yup';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { formBody } from '$lib/form-helpers';
import type { UserUpdate } from '$lib/user';
import { fromValidationError } from '$lib/utils';
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
	body: string;
};
type ValidationError = {
	[key in keyof UserUpdate]?: string;
};
type ActionResponse = {
	error?: boolean;
	success?: boolean;
	id?: number;
	errors?: ValidationError;
	user?: UserUpdate;
	message: string;
};

export const actions: Actions = {
	'upload-user': async ({ request }) => {
		console.log(`upload-user: frontend/src/routes/(pages)/admin/+page.server.ts`);
		const success = true;
		const error = true;
		const json = (await formBody(request)) as FormData;
		const users = JSON.parse(json.body) as UserUpdate[];
		const validateOptions = {
			abortEarly: false
		};

		let progress = 0;
		let upserted = 0;
		for (const user of users) {
			progress++;

			// 値のバリデーション
			try {
				const schema = object({
					id: number().notRequired().min(2),
					username: string()
						.notRequired()
						.min(4, '4文字以上で入力してください')
						.max(20, '20文字以下で入力してください')
						.matches(/^[0-9A-Za-z]+$/, '半角英数字のみ使用できます'),
					password: string()
						.notRequired()
						.min(4, '4文字以上で入力してください')
						.matches(/^[0-9A-Za-z]+$/, '半角英数字のみ使用できます'),
					displayName: string().notRequired().max(5, '5文字以下で入力してください'),
					abbrev: string().notRequired().max(5, '5文字以下で入力してください'),
					sei: string().notRequired(),
					mei: string().notRequired(),
					seiKana: string()
						.notRequired()
						.matches(/^[\p{scx=Katakana}]+$/u, 'カタカナで入力してください'),
					meiKana: string()
						.notRequired()
						.matches(/^[\p{scx=Katakana}]+$/u, 'カタカナで入力してください'),
					blocked: boolean().notRequired()
				});
				await schema.validate(user, validateOptions);
			} catch (err) {
				const message = `${progress}件目の入力データに不備があります。`;
				const errors = fromValidationError(err) as ValidationError;
				const data: ActionResponse = { error, message, errors, user };
				console.log(data);
				return fail(400, data);
			}

			const id = user.id ?? 0;

			// usernameのユニークチェック
			if (user.username) {
				const query = {
					where: {
						id: {
							not: id
						},
						username: user.username
					}
				};
				const count = await prisma.user.count(query);
				if (count > 0) {
					const message = `${user.username}: ユーザー名が重複しています。`;
					const data: ActionResponse = { error, message, id };
					console.log(data);
					return fail(400, data);
				}
			}

			// abbrevのユニークチェック
			if (user.abbrev) {
				const query = {
					where: {
						id: {
							not: id
						},
						abbrev: user.abbrev
					}
				};
				const count = await prisma.user.count(query);
				if (count > 0) {
					const message = `${user.abbrev}: 略称が重複しています。`;
					const data: ActionResponse = { error, message, id };
					console.log(data);
					return fail(400, data);
				}
			}

			const userInDB = await prisma.user.findUnique({
				where: {
					id
				}
			});

			const userData = {
				username: user.username ?? undefined,
				abbrev: user.abbrev ?? undefined,
				displayName: user.displayName ?? undefined,
				sei: user.sei ?? undefined,
				mei: user.mei ?? undefined,
				seiKana: user.seiKana ?? undefined,
				meiKana: user.meiKana ?? undefined,
				blocked: user.blocked ?? undefined,
				updatedAt: new Date()
			};
			if (userInDB) {
				// 更新する必要ある？
				if (
					!(Object.keys(user) as (keyof UserUpdate)[]).find(
						(key) => key !== 'password' && user[key] && user[key] !== userInDB[key]
					) &&
					(!user.password || comparePassword(user.password, userInDB.password))
				) {
					console.log(`${id}: 更新の必要なし`);
					continue;
				}

				const result = await prisma.user.update({
					where: {
						id: userInDB.id
					},
					data: {
						...userData,
						password: user.password ? encryptPassword(user.password) : undefined
					}
				});
				if (!result) {
					const message = `データベースの更新に失敗しました。`;
					const data: ActionResponse = { error, message, id, user };
					console.log(data);
					return fail(500, data);
				}
			} else {
				// 新規作成 -> 必須項目チェック
				try {
					const schema = object({
						username: string().required(),
						password: string().required(),
						displayName: string().required(),
						abbrev: string().required(),
						sei: string().required(),
						mei: string().required(),
						seiKana: string().required(),
						meiKana: string().required()
					});
					await schema.validate(user, validateOptions);
				} catch (err) {
					const message = `${progress}件目の入力データに不備があります。`;
					const errors = fromValidationError(err);
					const data: ActionResponse = { error, message, errors, user };
					console.log(data);
					return fail(400, data);
				}

				const result = await prisma.user.create({
					data: {
						...userData,
						password: encryptPassword(user.password),
						confirmed: true
					}
				});
				if (!result) {
					const message = `データベースの更新に失敗しました。`;
					const data: ActionResponse = { error, message, user };
					console.log(data);
					return fail(500, data);
				}
			}
			upserted++;
		}

		const message = `インポートしたデータは${upserted}件です。`;
		return { success, message };
	}
};
