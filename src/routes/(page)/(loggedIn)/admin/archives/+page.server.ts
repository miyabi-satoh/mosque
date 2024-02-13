import { fail } from '@sveltejs/kit';

import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { ArchiveSchema } from '$lib/schemas/zod';
import { db } from '$lib/server/db';

import type { PageServerLoad } from './$types';

const schema = z.object({
	archives: ArchiveSchema.omit({
		lastDir: true
	})
		.extend({
			id: ArchiveSchema.shape.id.optional()
		})
		.array()
});

export const load = (async () => {
	const archives = await db.archive.findMany({
		orderBy: [{ sortOrder: 'desc' }, { slug: 'asc' }]
	});
	const form = await superValidate({ archives }, schema);

	return { form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, schema);
		if (!form.valid) {
			console.error(form.errors);
			return fail(400, { form });
		}

		try {
			await db.$transaction(async (prisma): Promise<void> => {
				for (const data of form.data.archives) {
					await prisma.archive.upsert({
						where: { id: data.id ?? '' },
						create: data,
						update: data
					});
				}
			});
			return message(form, 'Archives updated!');
		} catch (e) {
			console.error(e);
		}
		return fail(400, { form: { ...form, message: 'Failed to update archives.' } });
	}
};
