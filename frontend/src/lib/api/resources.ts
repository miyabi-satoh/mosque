import { StrapiBase } from './strapiBase';
import type { Fetch } from './utils';
import type { IStrapiResourceListResponse, IStrapiResourceResponse } from '$models/interfaces';

type ListResponse = IStrapiResourceListResponse;
type SingleResponse = IStrapiResourceResponse;
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

	async getMulti(fetch: Fetch, args: object = {}) {
		return super.getMulti(fetch, {
			populate: '*',
			sort: {
				updatedAt: 'desc'
			},
			...args
		});
	}
}

export const apiResources = new StrapiResources();
