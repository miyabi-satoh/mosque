import { strapiUrl, type Fetch } from './utils';
import type { IStrapiMime } from '$models/interfaces';

export const apiMimes = {
	async getMulti(fetch: Fetch): Promise<IStrapiMime[]> {
		const res = await fetch(strapiUrl(`mimes`));
		if (res.ok) {
			const json = await res.json();
			return json.data;
		}

		throw new Error('apiMimes.getMulti');
	}
};
