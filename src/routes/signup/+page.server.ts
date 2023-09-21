import { fail, redirect } from '@sveltejs/kit';

import { UserRole } from '@prisma/client';
import { superValidate } from 'sveltekit-superforms/server';

import { signupSchema } from '$lib/schemas/signupSchema';
import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';

import type { Actions, PageServerLoad } from './$types';

const schema = signupSchema;

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) {
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
		} catch (e) {
			console.log(e);
			return fail(400, { form: { ...form, message: 'サインアップエラー' } });
		}
		return { form };
	}
};
