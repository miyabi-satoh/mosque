import { strapiUrl } from '$lib/utils';
import type { IPage } from '$models/interfaces';
import type { LayoutServerLoad } from './$types';

interface ILayoutFetchData {
	menuItems: IPage[];
	thisPageInfo: IPage;
}

const defaultData: ILayoutFetchData = {
	menuItems: [],
	thisPageInfo: {
		id: 0,
		attributes: {
			url: '',
			title: '',
			description: '',
			is_menuitem: false
		}
	}
};

export const load = (async ({ route, fetch }): Promise<ILayoutFetchData> => {
	try {
		let res = await fetch(strapiUrl(`pages?filters[is_menuitem][$eq]=true&sort=order:desc`));
		let json = await res.json();
		const menuItems = json.data as IPage[];

		res = await fetch(strapiUrl(`pages?filters[url][$eq]=${route.id}`));
		json = await res.json();
		const thisPageInfo = json.data[0] as IPage;
		// console.log(thisPageInfo);

		return {
			menuItems,
			thisPageInfo
		};
	} catch (err) {
		console.log(err);
	}
	return defaultData;
}) satisfies LayoutServerLoad<ILayoutFetchData>;
