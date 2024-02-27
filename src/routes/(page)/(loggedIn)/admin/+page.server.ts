import { URLS } from '$lib/consts';

import type { PageServerLoad } from './$types';

type MenuT = {
	href: string;
	label: string;
	icon?: string;
};
export const load: PageServerLoad = async () => {
	const menus: MenuT[] = [
		{
			href: URLS.ADMIN_ARCHIVES(),
			label: 'Archive Management',
			icon: 'mdi:archive'
		},
		{
			href: URLS.ADMIN_LINKS(),
			label: 'External Links Management',
			icon: 'mdi:web'
		},
		{
			href: URLS.ADMIN_ACCOUNTS,
			label: 'Account Management',
			icon: 'mdi:account-multiple'
		}
	];

	return { menus };
};
