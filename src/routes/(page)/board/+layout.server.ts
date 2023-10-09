import { error } from '@sveltejs/kit';

import { URLS } from '$lib/consts';
import { isWindows } from '$lib/utils';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ request, parent }) => {
	const data = await parent();
	if (data.user || isWindows(request.headers.get('User-Agent'))) {
		data.breadcrumbs.push({ label: 'Board', link: URLS.BOARD });

		return {
			breadcrumbs: data.breadcrumbs
		};
	}

	throw error(404, 'Not found');
}) satisfies LayoutServerLoad;
