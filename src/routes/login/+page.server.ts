import { fail, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms/server';

import { loginSchema } from '$lib/schemas/loginSchema';
import { auth } from '$lib/server/lucia';

import type { Actions, PageServerLoad } from './$types';

const schema = loginSchema;

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
		// ログイン処理
		try {
			const key = await auth.useKey(
				'username',
				form.data.username.toLowerCase(),
				form.data.password
			);
			await auth.deleteDeadUserSessions(key.userId);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			event.locals.auth.setSession(session);
		} catch (e) {
			console.log(e);
			return fail(400, { form: { ...form, message: 'ログインエラー' } });
		}
		return { form };
	}
};
