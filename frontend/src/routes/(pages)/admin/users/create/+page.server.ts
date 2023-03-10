import { ValidationError } from 'yup';
import type { Actions, PageServerLoad } from './$types';
import { createUserSchema, type UserCreate, type UserPostErrors } from '$lib/user';
import { convertToKatakana, fromRequest, fromValidationError, normalizeSearch } from '$lib/utils';
import { existsAbbrev, existsUsername } from '$lib/server/user';
import { encryptPassword } from '$lib/server/passwd';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ parent }) => {
	console.log(`frontend/src/routes/(pages)/admin/users/create/+page.server.ts`);
	const { breadcrumbParams } = await parent();
	return {
		breadcrumbParams: [
			...breadcrumbParams,
			{
				href: '',
				name: 'ユーザー追加'
			}
		],
		pageMeta: {
			title: 'ユーザー追加'
		}
	};
}) satisfies PageServerLoad;

type ActionResult = {
	success?: boolean;
	message?: string;
	formData: UserCreate;
	errors?: UserPostErrors;
};
export const actions: Actions = {
	default: async ({ request }): Promise<ActionResult> => {
		console.log(`POST frontend/src/routes/(pages)/admin/users/create/+page.server.ts`);
		const formData: UserCreate = await fromRequest(request);
		// console.log(formData);

		try {
			const validated = await createUserSchema.validate(formData, { abortEarly: false });
			// usernameのユニークチェック
			if (await existsUsername(validated.username)) {
				throw new ValidationError(`ユーザー名が重複しています。`, validated.username, 'username');
			}
			// abbrevのユニークチェック
			if (await existsAbbrev(validated.abbrev)) {
				throw new ValidationError(`略称が重複しています。`, validated.abbrev, 'abbrev');
			}

			// パスワードを暗号化
			validated.password = encryptPassword(validated.password);
			// カタカナに統一
			validated.seiKana = convertToKatakana(validated.seiKana);
			validated.meiKana = convertToKatakana(validated.meiKana);

			const keywords = [
				validated.username,
				validated.displayName,
				validated.abbrev,
				validated.sei,
				validated.mei,
				validated.seiKana,
				validated.meiKana
			];
			const result = await prisma.user.create({
				data: {
					...validated,
					keyword: normalizeSearch(keywords.join(' ')),
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
				// console.log(message);
				return { message, formData };
			}
		} catch (err) {
			// console.log(err);
			const message = `入力データに不備があります。`;
			const errors = fromValidationError(err);
			// console.log(errors);
			return { message, formData, errors };
		}

		return {
			success: true,
			formData
		};
	}
};
