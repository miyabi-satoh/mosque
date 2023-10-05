import { URLS } from '$lib/consts';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const data = await parent();
	data.breadcrumbs.push({ label: 'アカウント管理', link: URLS.ADMIN_ACCOUNTS });

	return {
		breadcrumbs: data.breadcrumbs
	};
}) satisfies LayoutServerLoad;
