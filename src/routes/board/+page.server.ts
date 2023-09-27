import { fail, redirect } from '@sveltejs/kit';

import bcrypt from 'bcryptjs';
import { superValidate } from 'sveltekit-superforms/server';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';
import { exclude } from '$lib/utils';
import { z } from '$lib/zod';

import type { Actions, PageServerLoad } from './$types';

const postSchema = z
	.object({
		id: z.string().optional(),
		delete: z.boolean().optional(),
		title: z.string().min(1, { message: '入力してください' }),
		content: z.string().min(1, { message: '入力してください' }),
		username: z.string().min(1, { message: '入力してください' }),
		password: z.string()
	})
	.refine(
		async (data) => {
			if (data.id) {
				const post = await db.post.findUnique({ where: { id: data.id } });
				if (post && post.password) {
					return bcrypt.compareSync(data.password, post.password);
				}
			}
			return true;
		},
		{
			message: '編集キーが違います',
			path: ['password']
		}
	);

export const load = (async () => {
	const posts = await db.post.findMany({
		orderBy: { updatedAt: 'desc' }
	});

	const form = await superValidate(postSchema);

	return {
		form,
		posts: posts.map((post) => {
			return {
				...post,
				password: !!post.password
			};
		})
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, postSchema);
		if (!form.valid) return fail(400, { form });

		try {
			if (!form.data.id) {
				// CREATE post
				const password = form.data.password ? bcrypt.hashSync(form.data.password) : undefined;
				await db.post.create({
					data: {
						...form.data,
						password
					}
				});
			} else {
				// UPDATE post
				await db.post.update({
					where: { id: form.data.id },
					data: {
						...exclude(form.data, ['id', 'delete']),
						password: undefined
					}
				});
			}
		} catch (e) {
			console.log(e);
			return fail(400, { form: { ...form, message: 'データベースの更新に失敗しました。' } });
		}

		throw redirect(302, URLS.BOARD);
	}
};
