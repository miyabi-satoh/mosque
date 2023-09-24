import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';

import type { PageServerLoad } from './$types';

type MenuT = {
	href: string;
	label: string;
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
				label: `${e.shortName}`
			} satisfies MenuT;
		})
	);
	menus.push(
		{
			href: URLS.ADMIN_SITELINK,
			label: `外部リンク`
		},
		{
			href: ``,
			label: `ユーザ`
		},
		{
			href: ``,
			label: `スタッフ`
		}
	);

	// const siteLinks = await db.siteLink.findMany({
	// 	orderBy: { sortOrder: 'asc' }
	// });
	return {
		menus
	};
};
