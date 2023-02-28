import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getUser } from '$lib/server/session';

export const load = (async ({ cookies }) => {
	console.log(`frontend/src/routes/(pages)/admin/+layout.server.ts`);
	const user = await getUser(cookies);
	if (!user || user.id != 1) {
		throw error(404, 'Not Found');
	}
}) satisfies LayoutServerLoad;
