import { error } from '@sveltejs/kit';
import { object, ref, string, ValidationError } from 'yup';
import type { Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { comparePassword } from '$lib/server/passwd';
import { fields } from '$lib/fields';
import { requestToObject, validationErrorToAssoc } from '$lib/utils';
import { passwordSchema, updateUser } from '$lib/server/user';
import type { UserUpdate } from '$lib/user';

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
		console.log(`POST /routes/(pages)/passwd/+page.server.ts`);
		if (!locals.user) {
			throw error(401, 'アクセス権がありません。');
		}
		const user = await prisma.user.findUnique({
			where: {
				id: locals.user.id
			},
			select: {
				password: true
			}
		});
		const formData: FormData = await requestToObject(request);
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
			const data: UserUpdate = {
				password: validated.newPassword
			};
			const _result = await updateUser(locals.user.id, data);
		} catch (err) {
			if (err instanceof ValidationError) {
				const message = `入力データに不備があります。`;
				const errors = validationErrorToAssoc(err);
				return { message, formData, errors };
			} else if (err instanceof Error) {
				const message = err.message;
				return { message, formData };
			}
		}

		const message = `更新しました。`;
		return {
			success: true,
			message,
			formData
		};
	}
};
