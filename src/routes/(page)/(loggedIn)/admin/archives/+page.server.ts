import { fail } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { db } from '$lib/server/db';

import type { PageServerLoad } from './$types';

const schema = z.object({
	orders: z
		.object({
			id: z.string(),
			sortOrder: z.number()
		})
		.array()
});

export const load = (async () => {
	const archives = await db.archive.findMany({
		orderBy: [{ sortOrder: 'asc' }, { path: 'asc' }]
	});
	const orders = archives.map((a) => ({ id: a.id, sortOrder: a.sortOrder }));
	const form = await superValidate({ orders }, zod(schema));

	return { archives, form };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) return fail(400, { form });

		try {
			for (const order of form.data.orders) {
				await db.archive.update({
					where: { id: order.id },
					data: { sortOrder: order.sortOrder }
				});
			}
		} catch (e) {
			console.error(e);
		}

		return { form };
	}
};
