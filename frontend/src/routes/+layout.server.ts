import { createBreadcrumbParams, type IBreadcrumbItemParam } from '$lib/Breadcrumb.svelte';
import { strapiUrl } from '$lib/utils';
import type { IPage } from '$models/interfaces';
import type { LayoutServerLoad } from './$types';

interface ILayoutFetchData {
	breadcrumbParams: IBreadcrumbItemParam[];
	menuItems: IPage[];
	thisPageInfo: IPage;
}

const defaultData: ILayoutFetchData = {
	breadcrumbParams: [],
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

export const load = (async ({ url, fetch }): Promise<ILayoutFetchData> => {
	try {
		const breadcrumbParams = await createBreadcrumbParams(fetch, url.pathname);
		let res = await fetch(strapiUrl(`pages?filters[is_menuitem][$eq]=true&sort=order:desc`));
		let json = await res.json();
		const menuItems = json.data as IPage[];

		res = await fetch(strapiUrl(`pages?filters[url][$eq]=${url.pathname}`));
		json = await res.json();
		console.log(json);
		const thisPageInfo = json.data[0] as IPage;
		console.log(thisPageInfo);

		return {
			breadcrumbParams,
			menuItems,
			thisPageInfo
		};
	} catch (err) {
		console.log(err);
	}
	return defaultData;
}) satisfies LayoutServerLoad<ILayoutFetchData>;
