import { strapiUrl, type Fetch } from './utils';
import type { IStrapiFormat } from '$models/interfaces';

export const apiFormats = {
	async getMulti(fetch: Fetch): Promise<IStrapiFormat[]> {
		const res = await fetch(strapiUrl(`formats/?sort=order:desc`));
		if (res.ok) {
			const json = await res.json();
			return json.data;
		}

		throw new Error('apiFormats.getMulti');
	},

	async get(fetch: Fetch, id: number | string): Promise<IStrapiFormat> {
		const res = await fetch(strapiUrl(`formats/${id}?populate=*`));
		if (res.ok) {
			const json = await res.json();
			return json.data;
		}

		throw new Error('apiFormats.get');
	}
};
