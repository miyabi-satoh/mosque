import { object, string, ValidationError } from 'yup';
import { fail } from '@sveltejs/kit';
import type { User } from '@prisma/client';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { clearSecret } from '$lib/user';
import { formBody } from '$lib/form-helpers';

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

type FormData = Pick<
	User,
	'username' | 'displayName' | 'abbrev' | 'sei' | 'mei' | 'seiKana' | 'meiKana'
>;
type FormError = {
	[key in keyof FormData]?: string;
};
export const actions = {
	default: async ({ request }) => {
		const values = await request.formData();
		const user = formBody(values) as FormData;
		const userSchema = object({
			username: string()
				.required()
				.min(4, '4文字以上で入力してください')
				.max(20, '20文字以下で入力してください')
				.matches(/^[0-9A-Za-z]+$/, '半角英数字のみ使用できます'),
			displayName: string().required().max(5, '5文字以下で入力してください'),
			abbrev: string().required().max(5, '5文字以下で入力してください'),
			sei: string().required(),
			mei: string().required(),
			seiKana: string()
				.required()
				.matches(/^[\p{scx=Katakana}]+$/u, 'カタカナで入力してください'),
			meiKana: string()
				.required()
				.matches(/^[\p{scx=Katakana}]+$/u, 'カタカナで入力してください')
		});

		try {
			const _validated = await userSchema.validate(user, {
				abortEarly: false
			});
			return {
				success: true,
				user
			};
		} catch (error) {
			if (error instanceof ValidationError) {
				const errors = error.inner.reduce((acc, err) => {
					return { ...acc, [err.path ?? 'error']: err.message };
				}, {});

				return {
					errors: errors as FormError,
					user
				};
			}
		}

		return fail(400, {
			message: `予期せぬエラーが発生しました`
		});
	}
} satisfies Actions;
