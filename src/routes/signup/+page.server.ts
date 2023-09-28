import { error, fail, redirect } from '@sveltejs/kit';

import { Prisma, UserRole } from '@prisma/client';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { PROVIDERID_USERNAME } from '$lib/consts';
import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';

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

export const load = (async ({ parent, request }) => {
	const data = await parent();
	if (data.user) {
		throw redirect(302, '/');
	}

	const ua = request.headers.get('user-agent')?.toLowerCase();
	if (!ua || !ua.match(/(windows nt)|(mac os x)/)) {
		throw error(404, 'Not found');
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
					providerId: PROVIDERID_USERNAME,
					providerUserId: form.data.username.toLowerCase(),
					password: form.data.password
				},
				attributes: {
					username: form.data.username,
					role: (await db.user.count()) === 0 ? UserRole.ADMIN : UserRole.USER,
					birthday: null,
					displayName: null,
					mei: null,
					meiKana: null,
					sei: null,
					seiKana: null
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
