import { StrapiBase, type IStrapiQuery } from './strapiBase';
import type { Fetch } from './utils';
import type { DeepNonNullable } from '$models/interfaces';
import type { paths } from '$models/strapi_schemas';

type SingleResponse = DeepNonNullable<
	paths['/pages/{id}']['get']['responses']['200']['content']['application/json']
>;
type ListResponse = DeepNonNullable<
	paths['/pages']['get']['responses']['200']['content']['application/json']
>;

class StrapiPages extends StrapiBase<ListResponse, SingleResponse> {
	constructor() {
		super('pages');
	}

	async getMulti(fetch: Fetch, query: IStrapiQuery = {}): Promise<ListResponse> {
		return super.getMulti(fetch, {
			sort: 'order:desc',
			...query
		});
	}

	async getMenuItems(fetch: Fetch) {
		return this.getMulti(fetch, {
			filters: {
				is_menuitem: {
					$eq: true
				}
			} as never
			// 'filters[is_menuitem][$eq]': 'true'
		});
	}

	async getByUrl(fetch: Fetch, url: string) {
		return this.getMulti(fetch, {
			filters: {
				url: {
					$eq: url
				}
			} as never,
			'pagination[limit]': 1
			// 'pagination[limit]': '1',
			// 'filters[url][$eq]': `${url}`
		});
	}
}

export const apiPages = new StrapiPages();
