import { StrapiBase } from './strapiBase';
import type { Fetch } from './utils';
import type { IStrapiLinkListResponse, IStrapiLinkResponse } from '$models/interfaces';

type ListResponse = IStrapiLinkListResponse;
type SingleResponse = IStrapiLinkResponse;
class StrapiLinks extends StrapiBase<ListResponse, SingleResponse> {
	constructor() {
		super('links');
	}

	async getMulti(fetch: Fetch, args = '') {
		return super.getMulti(fetch, `sort=order:desc${args ? '&' + args : ''}`);
	}
}

export const apiLinks = new StrapiLinks();
