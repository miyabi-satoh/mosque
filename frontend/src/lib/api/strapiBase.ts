import { strapiUrl, type Fetch } from './utils';

export class StrapiBase<ListResponse, SingleResponse> {
	protected endpoint: string;

	constructor(endpoint: string) {
		this.endpoint = strapiUrl(endpoint);
	}

	async getMulti(fetch: Fetch, args = ''): Promise<ListResponse> {
		const url = `${this.endpoint}${args ? '?' + args : ''}`;
		const response = await fetch(url);
		if (response.ok) {
			return await response.json();
		}
		// console.log(url);
		// console.log(response);

		throw response;
	}

	async get(fetch: Fetch, id: number | string, args = ''): Promise<SingleResponse> {
		const url = `${this.endpoint}/${id}${args ? '?' + args : ''}`;
		const response = await fetch(url);
		if (response.ok) {
			return await response.json();
		}
		// console.log(url);
		// console.log(response);

		throw response;
	}
}
