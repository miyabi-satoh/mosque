import { URLS } from '$lib/consts';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const data = await parent();
	data.breadcrumbs.push({ label: `アーカイブ管理`, link: URLS.ADMIN_ARCHIVES() });
	return {};
}) satisfies LayoutServerLoad;
