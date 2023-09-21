import { error, fail, redirect } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/client';
import { z } from 'zod';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	id: z.string().optional(),
	url: z.string().url('無効なURLです'),
	title: z.string().min(1, '入力してください'),
	sortOrder: z.number().default(0)
});

export const load = (async ({ params }) => {
	const siteLink = await (async (id) => {
		if (id) {
			const siteLink = await db.siteLink.findUnique({
				where: { id }
			});

			if (!siteLink) {
				throw error(404, 'Not Found');
			}
			return siteLink;
		}
		return undefined;
	})(params.id);

	const form = await superValidate(siteLink, schema);
	return { form };
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
			// catch-blockの後でredirect
		} catch (e) {
			console.log(e);
			return fail(400, { form: { ...form, message: 'エラー' } });
		}

		throw redirect(303, URLS.ADMIN);
	}
};
