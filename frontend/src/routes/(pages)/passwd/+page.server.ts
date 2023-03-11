import { error } from '@sveltejs/kit';
import { object, ref, string, ValidationError } from 'yup';
import type { Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { comparePassword, encryptPassword } from '$lib/server/passwd';
import { fields } from '$lib/fields';
import { fromRequest, fromValidationError } from '$lib/utils';
import { passwordSchema } from '$lib/server/user';

type FormData = {
	[K in keyof typeof fields.passwd]: string;
};
type FormErrors = {
	[K in keyof typeof fields.passwd]?: string;
};

type ActionResult = {
	success?: boolean;
	message?: string;
	formData: FormData;
	errors?: FormErrors;
};

export const actions: Actions = {
	default: async ({ request, locals }): Promise<ActionResult> => {
		console.log(`POST frontend/src/routes/(pages)/passwd/+page.server.ts`);
		if (!locals.user) {
			throw error(401, 'アクセス権がありません。');
		}
		const user = await prisma.user.findUnique({
			where: {
				id: locals.user.id
			}
		});
		const formData: FormData = await fromRequest(request);
		const passwdSchema = object({
			currentPassword: string()
				.required()
				.test('match-password', `${fields.passwd.currentPassword.label}が違います`, (value) =>
					comparePassword(value, user?.password ?? '')
				),
			newPassword: passwordSchema
				.required()
				.notOneOf(
					[ref(fields.passwd.currentPassword.name)],
					`${fields.passwd.newPassword.label}が${fields.passwd.currentPassword.label}と同一です`
				),
			confirmPassword: string().oneOf(
				[ref(fields.passwd.newPassword.name)],
				`${fields.passwd.newPassword.label}と${fields.passwd.confirmPassword.label}が一致していません`
			)
		} satisfies { [K in keyof typeof fields.passwd]: object });

		try {
			const validated = (await passwdSchema.validate(formData, { abortEarly: false })) as FormData;
			const result = await prisma.user.update({
				where: {
					id: locals.user.id
				},
				data: {
					password: encryptPassword(validated.newPassword)
				}
			});
			if (!result) {
				throw new Error(`データベースの更新に失敗しました。`);
			}
		} catch (err) {
			if (err instanceof ValidationError) {
				const message = `入力データに不備があります。`;
				const errors = fromValidationError(err);
				return { message, formData, errors };
			} else if (err instanceof Error) {
				const message = err.message;
				return { message, formData };
			}
		}

		return {
			success: true,
			formData
		};
	}
};
