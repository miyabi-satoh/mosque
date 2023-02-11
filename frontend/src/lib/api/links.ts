import { StrapiBase } from './strapiBase';
import type { DeepNonNullable, Fetch, IStrapiQuery, paths } from '$schemas';

type SingleResponse = DeepNonNullable<
	paths['/links/{id}']['get']['responses']['200']['content']['application/json']
>;
type ListResponse = DeepNonNullable<
	paths['/links']['get']['responses']['200']['content']['application/json']
>;

class StrapiLinks extends StrapiBase<ListResponse, SingleResponse> {
	constructor() {
		super('links');
	}

	async getMulti(fetch: Fetch, query: IStrapiQuery = {}): Promise<ListResponse> {
		return super.getMulti(fetch, {
			sort: 'order:desc',
			...query
		});
	}
}

export const apiLinks = new StrapiLinks();
