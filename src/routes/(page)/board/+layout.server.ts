import { error } from '@sveltejs/kit';

import { URLS } from '$lib/consts';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const data = await parent();
	if (data.showBoard) {
		data.breadcrumbs.push({ label: 'Board', link: URLS.BOARD });

		return {};
	}

	throw error(404, 'Not found');
}) satisfies LayoutServerLoad;
