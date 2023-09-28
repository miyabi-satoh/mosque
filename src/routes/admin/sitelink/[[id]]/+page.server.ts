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

export const load = (async ({ params }) => {
	const siteLinks = await db.siteLink.findMany({
		orderBy: { sortOrder: 'asc' }
	});
	const siteLink = siteLinks.find((s) => s.id === params.id);
	if (params.id && !siteLink) throw error(404, `Not found`);

	const form = await superValidate(siteLink, schema);
	return { form, siteLinks };
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
				await db.siteLink.upsert({
					where: { id: params.id ?? '' },
					create: form.data,
					update: form.data
				});
				return message(form, `The link has been saved.`);
			} else if (params.id) {
				// delete
				await db.siteLink.delete({
					where: { id: params.id }
				});
				redirectTo = URLS.ADMIN_SITELINK;
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
