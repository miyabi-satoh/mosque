import { strapiUrl, type Fetch } from './utils';
import type { IStrapiInfo } from '$models/interfaces';

export const apiInfos = {
	async getMulti(fetch: Fetch): Promise<IStrapiInfo[]> {
		const res = await fetch(strapiUrl(`infos/?sort=updatedAt:desc`));
		if (res.ok) {
			const json = await res.json();
			return json.data;
		}

		throw new Error('apiLinks.getMulti');
	},

	async getLatest(fetch: Fetch): Promise<IStrapiInfo> {
		const res = await fetch(strapiUrl(`infos/?pagination[limit]=1&sort=updatedAt:desc`));
		if (res.ok) {
			const json = await res.json();
			return json.data[0];
		}

		throw new Error('apiLinks.getLatest');
	},

	async get(fetch: Fetch, id: number | string): Promise<IStrapiInfo> {
		const res = await fetch(strapiUrl(`infos/${id}`));
		if (res.ok) {
			const json = await res.json();
			return json.data;
		}

		throw new Error('apiInfos.get');
	}
};
