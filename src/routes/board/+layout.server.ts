import { error } from '@sveltejs/kit';

import { hasStaffRole } from '$lib/utils';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ parent, request }) => {
	const ua = request.headers.get('user-agent')?.toLowerCase();
	if (ua?.match(/(windows nt)|(mac os x)/)) {
		// pass
	} else {
		const data = await parent();
		if (!data.user || !hasStaffRole(data.user)) {
			throw error(404, 'Not found');
		}
	}

	return {};
}) satisfies LayoutServerLoad;
