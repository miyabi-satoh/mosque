import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';

import type { PageServerLoad } from './$types';

type MenuT = {
	href: string;
	label: string;
	icon?: string;
};
export const load: PageServerLoad = async ({ parent }) => {
	const data = await parent();

	const menus: MenuT[] = [];
	const exam = await db.exam.findMany({
		orderBy: { sortOrder: 'asc' }
	});
	menus.push(
		...exam.map((e) => {
			return {
				href: `${URLS.ADMIN}/${e.examType}`,
				label: `${e.name} ファイル管理`,
				icon: 'mdi:file-multiple'
			} satisfies MenuT;
		})
	);
	menus.push(
		{
			href: URLS.ADMIN_LINKS,
			label: '外部リンク管理',
			icon: 'mdi:web'
		},
		{
			href: URLS.ADMIN_ACCOUNTS,
			label: 'アカウント管理',
			icon: 'mdi:account-multiple'
		}
	);

	return {
		menus,
		breadcrumbs: data.breadcrumbs
	};
};
