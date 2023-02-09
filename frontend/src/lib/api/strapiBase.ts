import qs from 'qs';
import { strapiUrl, type Fetch } from './utils';

export class StrapiBase<ListResponse, SingleResponse> {
	protected endpoint: string;

	constructor(endpoint: string) {
		this.endpoint = strapiUrl(endpoint);
	}

	async getMulti(fetch: Fetch, args: object = {}): Promise<ListResponse> {
		const query = qs.stringify(args, { encodeValuesOnly: true });
		const url = `${this.endpoint}${query ? '?' + query : ''}`;
		const response = await fetch(url);
		if (response.ok) {
			return await response.json();
		}

		throw response;
	}

	async get(fetch: Fetch, id: number | string, args: object = {}): Promise<SingleResponse> {
		const query = qs.stringify(args, { encodeValuesOnly: true });
		const url = `${this.endpoint}/${id}${query ? '?' + query : ''}`;
		const response = await fetch(url);
		if (response.ok) {
			return await response.json();
		}

		throw response;
	}
}
