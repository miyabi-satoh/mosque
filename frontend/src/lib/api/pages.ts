import { StrapiBase } from './strapiBase';
import type { Fetch } from './utils';
import type {
	IStrapiPageListResponse as ListResponse,
	IStrapiPageResponse as SingleResponse
} from '$models/interfaces';

class StrapiPages extends StrapiBase<ListResponse, SingleResponse> {
	constructor() {
		super('pages');
	}

	async getMulti(fetch: Fetch, args: object = {}) {
		return super.getMulti(fetch, {
			sort: {
				order: 'desc'
			},
			...args
		});
	}

	async getMenuItems(fetch: Fetch) {
		return this.getMulti(fetch, {
			filters: {
				is_menuitem: {
					$eq: true
				}
			}
			// 'filters[is_menuitem][$eq]': 'true'
		});
	}

	async getByUrl(fetch: Fetch, url: string) {
		return this.getMulti(fetch, {
			pagination: {
				limit: 1
			},
			filters: {
				url: {
					$eq: url
				}
			}
			// 'pagination[limit]': '1',
			// 'filters[url][$eq]': `${url}`
		});
	}
}

export const apiPages = new StrapiPages();
