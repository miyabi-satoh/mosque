import { fail, redirect } from '@sveltejs/kit';

import { LuciaError } from 'lucia';
import { message, superValidate } from 'sveltekit-superforms/server';

import { auth } from '$lib/server/lucia';
import { z } from '$lib/zod';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	username: z.string().min(1, `入力してください。`),
	password: z.string().min(1, `入力してください。`)
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
			if (e instanceof LuciaError) {
				if (e.message === 'AUTH_INVALID_PASSWORD' || e.message === 'AUTH_INVALID_KEY_ID') {
					return message(form, 'ログインIDまたはパスワードが違います。', {
						status: 400
					});
				}
				console.log({ ...e });
			} else {
				console.log(e);
			}
		}
		return message(form, 'ログインエラー', {
			status: 400
		});
	}
};
