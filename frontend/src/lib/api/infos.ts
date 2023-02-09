import { StrapiBase } from './strapiBase';
import type { Fetch } from './utils';
import type {
	IStrapiInfoListResponse as ListResponse,
	IStrapiInfoResponse as SingleResponse
} from '$models/interfaces';

class StrapiInfos extends StrapiBase<ListResponse, SingleResponse> {
	constructor() {
		super('infos');
	}

	async getMulti(fetch: Fetch, args: object = {}) {
		return super.getMulti(fetch, {
			sort: {
				updatedAt: 'desc'
			},
			...args
		});
	}

	async getLatestOne(fetch: Fetch) {
		return this.getMulti(fetch, {
			pagination: {
				limit: 1
			}
		});
	}
}

export const apiInfos = new StrapiInfos();
