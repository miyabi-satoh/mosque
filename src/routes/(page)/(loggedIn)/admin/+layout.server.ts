import { URLS } from '$lib/consts';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const data = await parent();
	data.breadcrumbs.push({ label: 'Dashboard', link: URLS.ADMIN });

	return {};
}) satisfies LayoutServerLoad;
