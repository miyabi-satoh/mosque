import { ValidationError } from 'yup';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { clearSecret, updateUserSchema, type UserCreate, type UserPostErrors } from '$lib/user';
import { convertToKatakana, fromRequest, fromValidationError, normalizeSearch } from '$lib/utils';
import { existsAbbrev, existsUsername } from '$lib/server/user';
import { encryptPassword } from '$lib/server/passwd';

export const load = (async ({ params, parent }) => {
	console.log(`frontend/src/routes/(pages)/admin/users/[id=number]/edit/+page.server.ts`);

	const { breadcrumbParams } = await parent();
	let user = await prisma.user.findUnique({
		where: {
			id: Number(params.id)
		}
	});
	if (user) {
		user = clearSecret(user);
	}

	return {
		user,
		pageMeta: {
			title: `ユーザー編集`
		},
		breadcrumbParams: [
			...breadcrumbParams,
			{
				name: `編集`
			}
		]
	};
}) satisfies PageServerLoad;

type ActionResult = {
	success?: boolean;
	message?: string;
	formData: UserCreate;
	errors?: UserPostErrors;
};
export const actions: Actions = {
	default: async ({ params, request }): Promise<ActionResult> => {
		console.log(`POST frontend/src/routes/(pages)/admin/users/[id=number]/edit/+page.server.ts`);
		const id = Number(params.id);
		const formData: UserCreate = await fromRequest(request);

		try {
			const validated = await updateUserSchema.validate(formData, { abortEarly: false });
			// usernameのユニークチェック
			if (validated.username && (await existsUsername(validated.username, id))) {
				throw new ValidationError(`ユーザー名が重複しています。`, validated.username, 'username');
			}
			// abbrevのユニークチェック
			if (validated.abbrev && (await existsAbbrev(validated.abbrev, id))) {
				throw new ValidationError(`略称が重複しています。`, validated.abbrev, 'abbrev');
			}

			// パスワードを暗号化
			if (validated.password) {
				validated.password = encryptPassword(validated.password);
			}
			// カタカナに統一
			if (validated.seiKana) {
				validated.seiKana = convertToKatakana(validated.seiKana);
			}
			if (validated.meiKana) {
				validated.meiKana = convertToKatakana(validated.meiKana);
			}

			const keywords = [
				validated.username,
				validated.displayName,
				validated.abbrev,
				validated.sei,
				validated.mei,
				validated.seiKana,
				validated.meiKana
			];
			const result = await prisma.user.update({
				where: {
					id
				},
				data: {
					...validated,
					password: validated.password ?? undefined,
					keyword: normalizeSearch(keywords.join(' ')),
					email: `${validated.username}@mosque.local`,
					updatedAt: new Date()
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
