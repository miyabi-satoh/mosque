import { fail, redirect } from '@sveltejs/kit';

import { format } from 'date-fns';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { STAFF_NAME, STAFF_PASS } from '$env/static/private';

import { URLS } from '$lib/consts';
import { auth } from '$lib/server/lucia';
import { hasStaffRole } from '$lib/utils';

import type { Actions, PageServerLoad } from './$types';

function isValidCode(code: string): boolean {
	const validCode = format(new Date(), 'cccddMMMLL').toLowerCase();
	return code === validCode;
}
const authSchema = z
	.object({
		code: z.string().min(1, { message: '認証コードを入力してください' })
	})
	.refine((data) => isValidCode(data.code), {
		message: '認証コードが違います',
		path: ['code']
	});

export const load = (async ({ locals }) => {
	// ログインセッションを取得
	const session = await locals.auth.validate();
	// 認可
	if (session && hasStaffRole(session.user)) {
		throw redirect(302, URLS.BOARD);
	}

	const form = await superValidate(authSchema);
	return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// フォームデータのバリデーション
		const form = await superValidate(request, authSchema);
		if (!form.valid) {
			console.log(`form validation failed`);
			return fail(400, { form });
		}
		// 認証処理
		try {
			const key = await auth.useKey('username', STAFF_NAME.toLowerCase(), STAFF_PASS);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
		} catch (e) {
			console.log(e);
			return fail(400, { form: { ...form, message: '認証エラー' } });
		}

		return { form };
	}
};
