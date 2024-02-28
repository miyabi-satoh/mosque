import { error, fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { URLS } from '$lib/consts';
import { ArchiveSchema } from '$lib/schemas/zod';
import { db } from '$lib/server/db';

import type { Actions, PageServerLoad } from './$types';

const schema = ArchiveSchema.pick({
	depth: true,
	path: true,
	root: true,
	title: true,
	description: true
}).extend({
	id: ArchiveSchema.shape.id.optional()
});

export const load: PageServerLoad = async ({ parent, params }) => {
	const data = await parent();
	data.breadcrumbs.push({
		label: params.id === 'new' ? 'New' : 'Edit',
		link: URLS.ADMIN_ARCHIVES('new')
	});

	const archive = await db.archive.findUnique({
		where: { id: params.id }
	});
	if (params.id !== 'new' && !archive) error(404, 'Archive not found.');

	const form = await superValidate(archive, zod(schema));
	if (form.data.depth < 1) form.data.depth = 4;

	return { form };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) return fail(400, { form });

		try {
			await db.$transaction(async (prisma) => {
				// const data = {
				// 	depth: form.data.depth,
				// 	path: form.data.path,
				// 	root: form.data.root,
				// 	title: form.data.title,
				// 	description: form.data.description
				// };
				const data = form.data;

				if (params.id === 'new') {
					await prisma.archive.create({ data });
				} else {
					await prisma.archive.update({
						where: { id: params.id },
						data
					});
				}
			});
			return message(form, 'The archive has been saved successfully.');
		} catch (e) {
			console.error(e);
			return message(form, 'Failed to update the database.', {
				status: 403
			});
		}
	}
};
