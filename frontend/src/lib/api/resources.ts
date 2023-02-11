import { StrapiBase, type IStrapiQuery } from './strapiBase';
import type { Fetch } from './utils';
import type { DeepNonNullable } from '$models/interfaces';
import type { paths } from '$models/strapi_schemas';

type SingleResponse = DeepNonNullable<
	paths['/resources/{id}']['get']['responses']['200']['content']['application/json']
>;
type ListResponse = DeepNonNullable<
	paths['/resources']['get']['responses']['200']['content']['application/json']
>;

class StrapiResources extends StrapiBase<ListResponse, SingleResponse> {
	constructor() {
		super('resources');
	}

	async get(fetch: Fetch, id: number | string, args: object = {}): Promise<SingleResponse> {
		return super.get(fetch, id, {
			populate: '*',
			...args
		});
	}

	async getMulti(fetch: Fetch, query: IStrapiQuery = {}): Promise<ListResponse> {
		return super.getMulti(fetch, {
			populate: '*',
			sort: 'updatedAt:desc',
			...query
		});
	}
}

export const apiResources = new StrapiResources();
