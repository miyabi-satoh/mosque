import { StrapiBase } from './strapiBase';
import type { Fetch } from './utils';
import type {
	IStrapiLinkListResponse as ListResponse,
	IStrapiLinkResponse as SingleResponse
} from '$models/interfaces';

class StrapiLinks extends StrapiBase<ListResponse, SingleResponse> {
	constructor() {
		super('links');
	}

	async getMulti(fetch: Fetch, args: object = {}) {
		return super.getMulti(fetch, {
			sort: 'order:desc',
			...args
		});
	}
}

export const apiLinks = new StrapiLinks();
