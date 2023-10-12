import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { db } from '$lib/server/db';

import type { PageServerLoad } from './$types';

const schema = z.object({
	checked: z.string().array()
});

export const load = (async () => {
	const users = await db.user.findMany({
		orderBy: { username: 'asc' }
	});

	const form = await superValidate(schema);

	return {
		form,
		users
	};
}) satisfies PageServerLoad;