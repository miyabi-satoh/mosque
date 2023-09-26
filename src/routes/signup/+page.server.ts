import { fail, redirect } from '@sveltejs/kit';

import { Prisma, UserRole } from '@prisma/client';
import { message, superValidate } from 'sveltekit-superforms/server';

import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';
import { z } from '$lib/zod';

import type { Actions, PageServerLoad } from './$types';

const schema = z
	.object({
		username: z.string().min(4),
		password: z.string().min(4),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'パスワードが一致していません',
		path: ['confirmPassword']
	});

export const load = (async ({ parent }) => {
	const data = await parent();
	if (data.user) {
		throw redirect(302, '/');
	}

	const form = await superValidate(schema);
	return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		// フォームデータのバリデーション
		const form = await superValidate(event, schema);
		if (!form.valid) {
			return fail(400, { form });
		}
		// サインアップ処理
		try {
			const user = await auth.createUser({
				key: {
					providerId: 'username',
					providerUserId: form.data.username.toLowerCase(),
					password: form.data.password
				},
				attributes: {
					username: form.data.username,
					role: (await db.user.count()) === 0 ? UserRole.ADMIN : UserRole.USER
				}
			});
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			event.locals.auth.setSession(session);
			return { form };
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				console.log({ ...e });
			} else {
				console.log(e);
			}
		}
		return message(form, 'サインアップに失敗しました。', {
			status: 400
		});
	}
};
