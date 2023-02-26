import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUser } from '$lib/server/session';

// frontend/src/routes/admin/+page.server.ts
export const load = (async ({ cookies }) => {
	const user = await getUser(cookies);
	if (!user || user.id != 1) {
		throw error(404, 'Not Found');
	}

	console.log(`server load`);
}) satisfies PageServerLoad;
