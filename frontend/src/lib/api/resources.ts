import { StrapiBase } from './strapiBase';
import type { DeepNonNullable, Fetch, IStrapiQuery, paths } from '$schemas';

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
