import qs from 'qs';
import { strapiUrl, type Fetch } from './utils';

export interface IStrapiQuery {
	sort?: string;
	'pagination[withCount]'?: boolean;
	'pagination[page]'?: number;
	'pagination[pageSize]'?: number;
	'pagination[start]'?: number;
	'pagination[limit]'?: number;
	fields?: string;
	populate?: string;
	filters?: Record<string, never>;
	locale?: string;
}
export class StrapiBase<ListResponse, SingleResponse> {
	protected endpoint: string;

	constructor(endpoint: string) {
		this.endpoint = strapiUrl(endpoint);
	}

	async getMulti(fetch: Fetch, query: IStrapiQuery = {}): Promise<ListResponse> {
		const q = qs.stringify(query, { encodeValuesOnly: true });
		const url = `${this.endpoint}${q ? '?' + q : ''}`;
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
