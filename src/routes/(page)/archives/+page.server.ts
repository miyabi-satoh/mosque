import { URLS } from '$lib/consts';

import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const data = await parent();
	data.breadcrumbs.push({ label: `その他のアーカイブ`, link: URLS.ARCHIVES() });

	const archives = [
		{
			id: 1,
			title: '共通テスト模試'
		},
		{
			id: 2,
			title: '計算・一行問題(2021)'
		}
	];
	return { archives };
}) satisfies PageServerLoad;
