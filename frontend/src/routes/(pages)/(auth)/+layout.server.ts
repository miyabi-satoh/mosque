import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	console.log(`/routes/(pages)/(auth)/+layout.server.ts`);
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}
}) satisfies LayoutServerLoad;
