import { error, fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/client';

import { db } from '$lib/server/db';
import { z } from '$lib/zod';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	id: z.string().optional(),
	url: z.string().url(),
	title: z.string().min(1, '入力してください'),
	sortOrder: z.number().default(0)
});

export const load = (async ({ params }) => {
	const siteLinks = await db.siteLink.findMany({
		orderBy: { sortOrder: 'asc' }
	});
	const siteLink = siteLinks.find((s) => s.id === params.id);
	if (params.id && !siteLink) throw error(404, `指定された外部リンクデータが見つかりません。`);

	const form = await superValidate(siteLink, schema);
	return { form, siteLinks };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, schema);
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			if (!form.data.id) {
				// create
				const siteLink = await db.siteLink.create({
					data: form.data
				});
				form.data.id = siteLink.id;
				return message(form, '作成しました。');
			}

			if (!formData.has('delete')) {
				// update
				await db.siteLink.update({
					where: { id: form.data.id },
					data: form.data
				});
				return message(form, `更新しました。`);
			}

			// delete
			await db.siteLink.delete({
				where: { id: form.data.id }
			});
			return message(form, `削除しました。`);

			// catch-blockの後でredirect
		} catch (e) {
			console.log(e);
			return fail(400, { form: { ...form, message: 'エラー' } });
		}
	}
};
