// import { strapiUrl, type Fetch } from './utils';
// import type { IStrapiLink } from '$models/interfaces';

// export const apiLinks = {
// 	async getMulti(fetch: Fetch, filter = ''): Promise<IStrapiLink[]> {
// 		const url = strapiUrl(`links?sort=order:desc${filter ? '&' + filter : ''}`);
// 		const res = await fetch(url);
// 		if (res.ok) {
// 			const json = await res.json();
// 			return json.data;
// 		}

// 		throw new Error('apiLinks.getMulti');
// 	}
// };
import { StrapiBase } from './strapiBase';
import type { Fetch } from './utils';
import type { paths } from '$models/strapi_schemas';

type ListResponse = paths['/links']['get']['responses']['200']['content']['application/json'];
type SingleResponse =
	paths['/links/{id}']['get']['responses']['200']['content']['application/json'];
class StrapiLinks extends StrapiBase<ListResponse, SingleResponse> {
	constructor() {
		super('links');
	}

	async getMulti(fetch: Fetch, args = '') {
		return super.getMulti(fetch, `sort=order:desc${args ? '&' + args : ''}`);
	}
}

export const apiLinks = new StrapiLinks();
export type { ListResponse as IStrapiLinksResponse };
