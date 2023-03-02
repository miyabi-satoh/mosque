import { fail } from '@sveltejs/kit';
import { object } from 'yup';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { formBody } from '$lib/form-helpers';
import { UserValidations, type UserUpdate } from '$lib/user';
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
type FormError = {
	[key in keyof UserUpdate]?: string;
};

export const actions: Actions = {
	'upload-user': async ({ request }) => {
		console.log(`upload-user: frontend/src/routes/(pages)/admin/+page.server.ts`);
		const success = true;
		const error = true;
		const json = (await formBody(request)) as FormData;
		const users = JSON.parse(json.body) as UserUpdate[];
		const userSchema = object({
			id: UserValidations.id(),
			username: UserValidations.username(),
			password: UserValidations.password(),
			displayName: UserValidations.displayName(),
			abbrev: UserValidations.abbrev(),
			sei: UserValidations.sei(),
			mei: UserValidations.mei(),
			seiKana: UserValidations.seiKana(),
			meiKana: UserValidations.meiKana(),
			blocked: UserValidations.blocked()
		});
		const validateOptions = {
			abortEarly: false
		};

		let progress = 0;
		for (const user of users) {
			// 値のバリデーション
			try {
				await userSchema.validate(user, validateOptions);
			} catch (error) {
				const errors = fromValidationError(error) as FormError;
				return fail(400, { error, errors, user });
			}

			// usernameのユニークチェック
			if (user.username) {
				const query = {
					where: {
						id: {
							not: user.id ?? 0
						},
						username: user.username
					}
				};
				const count = await prisma.user.count(query);
				if (count > 0) {
					return fail(400, {
						error,
						id: user.id,
						message: `${user.username}: ユーザー名が重複しています。`
					});
				}
			}

			// abbrevのユニークチェック
			if (user.abbrev) {
				const query = {
					where: {
						id: {
							not: user.id ?? 0
						},
						abbrev: user.abbrev
					}
				};
				const count = await prisma.user.count(query);
				if (count > 0) {
					return fail(400, {
						error,
						id: user.id,
						message: `${user.abbrev}: 略称が重複しています。`
					});
				}
			}

			const userInDB = await prisma.user.findUnique({
				where: {
					id: user.id ?? 0
				}
			});

			if (userInDB) {
				// 更新する必要ある？
				if (
					user.username === userInDB.username &&
					user.abbrev === userInDB.abbrev &&
					user.displayName === userInDB.displayName &&
					user.sei === userInDB.sei &&
					user.mei === userInDB.mei &&
					user.seiKana === userInDB.seiKana &&
					user.meiKana === userInDB.meiKana &&
					user.blocked === userInDB.blocked &&
					(user.password === undefined || comparePassword(user.password, userInDB.password))
				) {
					console.log(`${user.id}: 更新の必要なし`);
					continue;
				}

				const result = await prisma.user.update({
					where: {
						id: userInDB.id
					},
					data: {
						...user,
						password: user.password ? encryptPassword(user.password) : undefined,
						updatedAt: new Date()
					}
				});
				if (!result) {
					return fail(500, {
						error,
						id: user.id,
						message: `データベースの更新に失敗しました`
					});
				}
			} else {
				// 新規作成 -> 必須項目チェック
				const userRequiredSchema = object({
					username: UserValidations.username().required(),
					displayName: UserValidations.displayName().required(),
					abbrev: UserValidations.abbrev().required(),
					sei: UserValidations.sei().required(),
					mei: UserValidations.mei().required(),
					seiKana: UserValidations.seiKana().required(),
					meiKana: UserValidations.meiKana().required()
				});
				try {
					await userRequiredSchema.validate(user, validateOptions);
				} catch (error) {
					const errors = fromValidationError(error);
					return fail(400, { error, errors, user });
				}

				const result = await prisma.user.create({
					data: {
						...user,
						confirmed: true,
						updatedAt: new Date()
					}
				});
				if (!result) {
					return fail(500, {
						error,
						message: `データベースの更新に失敗しました`
					});
				}
			}
			progress++;
		}

		return {
			success,
			message: `${progress}件のデータを更新しました`
		};
	}
};
