import { strapiUrl, type Fetch } from './utils';
import type { IStrapiLink } from '$models/interfaces';

export const apiLinks = {
	async getMulti(fetch: Fetch): Promise<IStrapiLink[]> {
		const res = await fetch(strapiUrl(`links/?sort=order:desc`));
		if (res.ok) {
			const json = await res.json();
			return json.data;
		}

		throw new Error('apiLinks.getMulti');
	}
};
