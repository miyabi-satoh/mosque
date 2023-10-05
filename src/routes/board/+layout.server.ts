import { error } from '@sveltejs/kit';

import { URLS } from '$lib/consts';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const data = await parent();
	if (data.user || !data.isMobile) {
		data.breadcrumbs.push({ label: 'Board', link: URLS.BOARD });

		return {
			breadcrumbs: data.breadcrumbs
		};
	}

	throw error(404, 'Not found');
}) satisfies LayoutServerLoad;
