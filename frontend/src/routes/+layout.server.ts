import { apiUrl } from '$lib/utils';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	try {
		const res = await fetch(apiUrl(`pages/menuitems`));
		const items = await res.json();
		return {
			menuItems: items
		};
	} catch (err) {
		console.log(err);
	}

	return {
		menuItems: [
			{
				id: 1,
				title: 'リンク集',
				url: '/links'
			}
		]
	};
}) satisfies LayoutServerLoad;
