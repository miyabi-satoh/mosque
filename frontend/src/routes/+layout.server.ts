import type { IPage } from '$lib/interfaces';
import { apiUrl } from '$lib/utils';
import type { LayoutServerLoad } from './$types';

interface ILayoutFetchData {
	menuItems: IPage[];
	pgInfo: IPage;
}

export const load = (async ({ route, fetch }): Promise<ILayoutFetchData> => {
	try {
		let res = await fetch(apiUrl(`pages/menuitems`));
		const menuItems = await res.json();

		const params = new URLSearchParams({
			url: route.id as string
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
		pgInfo: {} as IPage
	};
}) satisfies LayoutServerLoad;
