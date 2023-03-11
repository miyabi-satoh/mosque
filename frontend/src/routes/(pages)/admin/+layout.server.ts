import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { userType } from '$lib/user';

export const load = (async ({ locals }) => {
	console.log(`frontend/src/routes/(pages)/admin/+layout.server.ts`);
	if (!locals.user || locals.user.type !== userType.sysadmin) {
		throw error(404, 'Not Found');
	}
}) satisfies LayoutServerLoad;
