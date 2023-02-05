// import { strapiUrl, type Fetch } from './utils';
// import type { IStrapiInfo } from '$models/interfaces';

// export const apiInfos = {
// 	async getMulti(fetch: Fetch): Promise<IStrapiInfo[]> {
// 		const res = await fetch(strapiUrl(`infos/?sort=updatedAt:desc`));
// 		if (res.ok) {
// 			const json = await res.json();
// 			return json.data;
// 		}

// 		throw new Error('apiLinks.getMulti');
// 	},

// 	async getLatest(fetch: Fetch): Promise<IStrapiInfo> {
// 		const res = await fetch(strapiUrl(`infos/?pagination[limit]=1&sort=updatedAt:desc`));
// 		if (res.ok) {
// 			const json = await res.json();
// 			return json.data[0];
// 		}

// 		throw new Error('apiLinks.getLatest');
// 	},

// 	async get(fetch: Fetch, id: number | string): Promise<IStrapiInfo> {
// 		const res = await fetch(strapiUrl(`infos/${id}`));
// 		if (res.ok) {
// 			const json = await res.json();
// 			return json.data;
// 		}

// 		throw new Error('apiInfos.get');
// 	}
// };
import { StrapiBase } from './strapiBase';
import type { Fetch } from './utils';
import type { IStrapiInfoListResponse, IStrapiInfoResponse } from '$models/interfaces';

type ListResponse = IStrapiInfoListResponse;
type SingleResponse = IStrapiInfoResponse;
class StrapiInfos extends StrapiBase<ListResponse, SingleResponse> {
	constructor() {
		super('infos');
	}

	async getMulti(fetch: Fetch, args = '') {
		return super.getMulti(fetch, `sort=updatedAt:desc${args ? '&' + args : ''}`);
	}

	async getLatestOne(fetch: Fetch) {
		return this.getMulti(fetch, `pagination[limit]=1`);
	}
}

export const apiInfos = new StrapiInfos();
