import { redirect } from '@sveltejs/kit';

import { URLS } from '$lib/consts';
import { hasStaffRole } from '$lib/utils';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ parent, url }) => {
	if (url.pathname !== URLS.BOARD_AUTH) {
		const data = await parent();
		if (!data.user || !hasStaffRole(data.user)) {
			throw redirect(302, URLS.BOARD_AUTH);
		}
	}

	return {};
}) satisfies LayoutServerLoad;
