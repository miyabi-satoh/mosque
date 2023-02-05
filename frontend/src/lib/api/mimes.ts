import { StrapiBase } from './strapiBase';
import type { IStrapiMimeListResponse, IStrapiMimeResponse } from '$models/interfaces';

type ListResponse = IStrapiMimeListResponse;
type SingleResponse = IStrapiMimeResponse;
class StrapiMimes extends StrapiBase<ListResponse, SingleResponse> {
	constructor() {
		super('mimes');
	}
}

export const apiMimes = new StrapiMimes();
