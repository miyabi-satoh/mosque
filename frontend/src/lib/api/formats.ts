import { StrapiBase } from './strapiBase';
import type { Fetch } from './utils';
import type { IStrapiFormatListResponse, IStrapiFormatResponse } from '$models/interfaces';

type ListResponse = IStrapiFormatListResponse;
type SingleResponse = IStrapiFormatResponse;
class StrapiFormats extends StrapiBase<ListResponse, SingleResponse> {
	constructor() {
		super('formats');
	}

	async get(fetch: Fetch, id: number | string, args = ''): Promise<SingleResponse> {
		return super.get(fetch, id, `populate=*${args ? '&' + args : ''}`);
	}

	async getMulti(fetch: Fetch, args = '') {
		return super.getMulti(fetch, `sort=order:desc${args ? '&' + args : ''}`);
	}
}

export const apiFormats = new StrapiFormats();
