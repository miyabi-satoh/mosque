import { URLS } from '$lib/consts';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const data = await parent();
	data.breadcrumbs.push({ label: `Links`, link: URLS.ADMIN_LINKS() });
	return {};
};
