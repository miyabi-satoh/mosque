import { error } from '@sveltejs/kit';

import { hasAdminRole } from '$lib/utils';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const data = await parent();
	// 認可
	if (!data.user || !hasAdminRole(data.user)) {
		throw error(404, 'Not found');
	}

	return {};
}) satisfies LayoutServerLoad;
