import { StrapiBase, type IStrapiQuery } from './strapiBase';
import type { Fetch } from './utils';
import type { DeepNonNullable } from '$models/interfaces';
import type { paths } from '$models/strapi_schemas';

type SingleResponse = DeepNonNullable<
	paths['/infos/{id}']['get']['responses']['200']['content']['application/json']
>;
type ListResponse = DeepNonNullable<
	paths['/infos']['get']['responses']['200']['content']['application/json']
>;

class StrapiInfos extends StrapiBase<ListResponse, SingleResponse> {
	constructor() {
		super('infos');
	}

	async getMulti(fetch: Fetch, query: IStrapiQuery = {}): Promise<ListResponse> {
		return super.getMulti(fetch, {
			sort: 'updatedAt:desc',
			...query
		});
	}

	async getLatestOne(fetch: Fetch) {
		return this.getMulti(fetch, {
			'pagination[limit]': 1
		});
	}
}

export const apiInfos = new StrapiInfos();
