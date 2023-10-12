import { error } from '@sveltejs/kit';

import { URLS } from '$lib/consts';
import { hasAdminRole } from '$lib/utils';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const data = await parent();
	if (!hasAdminRole(data.user)) {
		throw error(404, 'Not found');
	}

	data.breadcrumbs.push({ label: 'Dashboard', link: URLS.ADMIN });

	return {};
}) satisfies LayoutServerLoad;
