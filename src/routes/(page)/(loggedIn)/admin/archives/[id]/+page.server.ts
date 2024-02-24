import { error, fail, redirect } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { URLS } from '$lib/consts';
import { ArchiveSchema } from '$lib/schemas/zod';
import { db } from '$lib/server/db';

import type { PageServerLoad } from './$types';

const schema = ArchiveSchema.pick({
	path: true,
	root: true,
	title: true
}).extend({
	id: ArchiveSchema.shape.id.optional()
});

export const load = (async ({ parent, params }) => {
	const data = await parent();
	data.breadcrumbs.push({
		label: params.id === 'new' ? '作成' : '編集',
		link: URLS.ADMIN_ARCHIVES('new')
	});

	const archive = await db.archive.findUnique({
		where: {
			id: params.id
		}
	});
	if (params.id !== 'new' && !archive) error(404, 'Archive not found.');

	const form = await superValidate(archive, zod(schema));
	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(schema));
		if (!form.valid) return fail(400, { form });

		let doRedirect = false;
		try {
			if (!form.data.id) {
				// CREATE archive
				await db.archive.create({
					data: form.data
				});

				return message(form, 'Archive created!');
			} else {
				const archive = await db.archive.findUnique({
					where: {
						id: form.data.id
					}
				});
				if (!archive) error(404, 'Archive not found.');

				if (formData.has('delete')) {
					// DELETE user
					await db.archive.delete({
						where: { id: form.data.id }
					});
					doRedirect = true;
				} else {
					// UPDATE archive
					await db.archive.update({
						where: { id: form.data.id },
						data: form.data
					});
					return message(form, 'Archive updated!');
				}
			}
		} catch (e) {
			console.error(e);
		}

		if (doRedirect) redirect(303, URLS.ADMIN_ARCHIVES());

		return fail(400, { form });
	}
};
