import { apiUrl } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({ fetch }) => {
	try {
		let res = await fetch(apiUrl(`pages/menuitems`));
		const menuItems = await res.json();

		const params = new URLSearchParams({
			url: '/'
		});
		res = await fetch(apiUrl(`pages/?${params}`));
		const pgInfo = await res.json();

		return {
			menuItems,
			pgInfo
		};
	} catch (err) {
		console.log(err);
	}

	return {
		menuItems: [],
		pgInfo: {}
	};
}) satisfies PageServerLoad;
