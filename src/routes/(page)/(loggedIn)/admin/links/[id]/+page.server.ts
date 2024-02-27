import { error, fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import { URLS } from '$lib/consts';
import { LinkSchema } from '$lib/schemas/zod';
import { db } from '$lib/server/db';

import type { Actions, PageServerLoad } from './$types';

const schema = LinkSchema.pick({
	title: true,
	url: true
}).extend({
	id: LinkSchema.shape.id.optional()
});

export const load: PageServerLoad = async ({ parent, params }) => {
	const data = await parent();
	data.breadcrumbs.push({
		label: params.id === 'new' ? 'New' : 'Edit',
		link: URLS.ADMIN_LINKS('new')
	});

	const link = await db.link.findUnique({
		where: { id: params.id }
	});
	if (params.id !== 'new' && !link) error(404, 'Link not found.');

	const form = await superValidate(link, zod(schema));

	return { form };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) return fail(400, { form });

		try {
			await db.$transaction(async (prisma) => {
				const data = {
					title: form.data.title,
					url: form.data.url
				};

				if (params.id === 'new') {
					await prisma.link.create({ data });
				} else {
					await prisma.link.update({
						where: { id: params.id },
						data
					});
				}
			});
			return message(form, 'The link has been saved successfully.');
		} catch (e) {
			console.error(e);
			return message(form, 'Failed to update the database.', {
				status: 403
			});
		}
	}
};
