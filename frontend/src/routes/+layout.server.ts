import type { IPage } from '$lib/interfaces';
import { apiUrl } from '$lib/utils';
import type { LayoutServerLoad } from './$types';

interface ILayoutFetchData {
	menuItems: IPage[];
	thisPageInfo: IPage;
}

const defaultData: ILayoutFetchData = {
	menuItems: [],
	thisPageInfo: {
		id: 0,
		url: '',
		title: '',
		description: '',
		is_menuitem: false
	}
};

export const load = (async ({ route, fetch }): Promise<ILayoutFetchData> => {
	try {
		let res = await fetch(apiUrl(`pages/menuitems`));
		const menuItems = await res.json();

		const params = new URLSearchParams({
			url: route.id as string
		});
		res = await fetch(apiUrl(`pages/?${params}`));
		const thisPageInfo = await res.json();

		return {
			menuItems,
			thisPageInfo
		};
	} catch (err) {
		console.log(err);
	}
	return defaultData;
}) satisfies LayoutServerLoad<ILayoutFetchData>;
