import { error, fail, redirect } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/client';
import { z } from 'zod';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	url: z.string().url(),
	title: z.string(),
	sortOrder: z.number().default(0)
});

export const load = (async ({ params, parent, url }) => {
	const links = await db.link.findMany({
		orderBy: { sortOrder: 'asc' }
	});
	const link = links.find((s) => s.id === params.id);
	if (params.id && !link) throw error(404, `Not found`);

	const data = await parent();
	data.breadcrumbs.push({ label: '外部リンク管理', link: URLS.ADMIN_LINKS });
	if (params.id) {
		data.breadcrumbs.push({ label: '編集', link: url.pathname });
	}

	const form = await superValidate(link, schema);
	return {
		form,
		links
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, schema);
		if (!form.valid) {
			return fail(400, { form });
		}

		let redirectTo = '';
		try {
			if (!formData.has('delete')) {
				// upsert
				await db.link.upsert({
					where: { id: params.id ?? '' },
					create: form.data,
					update: form.data
				});

				// clear form
				form.data.sortOrder = 0;
				form.data.title = '';
				form.data.url = '';
				return message(form, `The link has been saved.`);
			} else if (params.id) {
				// delete
				await db.link.delete({
					where: { id: params.id }
				});
				redirectTo = URLS.ADMIN_LINKS;
			}
		} catch (e) {
			console.log(e);
		}

		if (redirectTo) {
			throw redirect(303, redirectTo);
		}

		return message(form, 'An error occurred.', {
			status: 400
		});
	}
};