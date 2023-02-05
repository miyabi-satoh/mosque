import { strapiUrl, type Fetch } from './utils';

export class StrapiBase<ListResponse, SingleResponse> {
	protected endpoint: string;

	constructor(endpoint: string) {
		this.endpoint = strapiUrl(endpoint);
	}

	async getMulti(fetch: Fetch, args = ''): Promise<ListResponse> {
		// const url = strapiUrl(`links?sort=order:desc${filter ? '&' + filter : ''}`);
		const response = await fetch(`${this.endpoint}${args ? '?' + args : ''}`);
		if (response.ok) {
			return await response.json();
		}
		console.log(`Response error on getMulti@${this.constructor.name}`);
		console.log(response);

		throw response;
	}

	async get(fetch: Fetch, id: number | string, args = ''): Promise<SingleResponse> {
		// const res = await fetch(strapiUrl(`formats/${id}?populate=*`));
		const response = await fetch(`${this.endpoint}/${id}${args ? '?' + args : ''}`);
		if (response.ok) {
			return await response.json();
		}
		console.log(`Response error on get@${this.constructor.name}`);
		console.log(response);

		throw response;
	}
}
