import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	const session = cookies.get('session');
	if (!session) {
		throw error(404, 'Not Found');
	}

	console.log(`server load`);
}) satisfies PageServerLoad;
