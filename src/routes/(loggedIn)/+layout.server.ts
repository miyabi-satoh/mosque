import { error } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const data = await parent();
	if (!data.user) {
		throw error(404, 'Not found');
	}
	return {};
}) satisfies LayoutServerLoad;
