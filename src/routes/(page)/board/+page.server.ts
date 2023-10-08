import { fail, redirect } from '@sveltejs/kit';

import bcrypt from 'bcryptjs';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';
import { exclude } from '$lib/utils';

import type { Actions, PageServerLoad } from './$types';

const postSchema = z
	.object({
		id: z.string().optional(),
		delete: z.boolean().optional(),
		title: z.string().min(1),
		content: z.string().min(1),
		username: z.string().min(1),
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

export const load = (async ({ parent }) => {
	const data = await parent();

	const posts = await db.post.findMany({
		orderBy: { updatedAt: 'desc' }
	});

	const form = await superValidate(postSchema);

	return {
		form,
		breadcrumbs: data.breadcrumbs,
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
			return message(form, 'Failed to update data.', {
				status: 400
			});
		}

		throw redirect(302, URLS.BOARD);
	}
};
