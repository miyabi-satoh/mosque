import { strapiUrl, type Fetch } from './utils';
import type { IStrapiPage, IStrapiPageListResponse } from '$models/interfaces';

export const apiPages = {
	async getMenuItems(fetch: Fetch): Promise<IStrapiPage[]> {
		const res = await fetch(strapiUrl(`pages?filters[is_menuitem][$eq]=true&sort=order:desc`));
		if (res.ok) {
			const json: IStrapiPageListResponse = await res.json();
			return json.data;
		}

		throw new Error('apiPages.getMenuItems');
	},

	async getByUrl(fetch: Fetch, url: string): Promise<IStrapiPage> {
		const res = await fetch(strapiUrl(`pages?pagination[limit]=1&filters[url][$eq]=${url}`));
		if (res.ok) {
			const json: IStrapiPageListResponse = await res.json();
			if (json.meta.pagination.total > 0) {
				return json.data[0];
			}
		}

		throw new Error('apiPages.getByUrl');
	}
};
