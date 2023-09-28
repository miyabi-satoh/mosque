import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';

import type { PageServerLoad } from './$types';

type MenuT = {
	href: string;
	label: string;
	icon?: string;
};
export const load: PageServerLoad = async () => {
	const menus: MenuT[] = [];
	const exam = await db.exam.findMany({
		orderBy: { sortOrder: 'asc' }
	});
	menus.push(
		...exam.map((e) => {
			return {
				href: `${URLS.ADMIN}/${e.examType}`,
				label: `Manage ${e.fullName}`,
				icon: 'mdi:file-multiple'
			} satisfies MenuT;
		})
	);
	menus.push(
		{
			href: URLS.ADMIN_LINKS,
			label: 'Manage external links',
			icon: 'mdi:web'
		},
		{
			href: URLS.ADMIN_ACCOUNTS,
			label: 'Manage user accounts',
			icon: 'mdi:account-multiple'
		}
	);

	return {
		menus
	};
};
