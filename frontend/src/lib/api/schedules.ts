import { StrapiBase } from './strapiBase';
import type { Fetch } from './utils';
import type {
	IStrapiScheduleListResponse as ListResponse,
	IStrapiScheduleResponse as SingleResponse,
	IStrapiScheduleDateListResponse as HeadListResponse,
	IStrapiScheduleDateResponse as HeadSingleResponse
} from '$models/interfaces';

class StrapiSchedules extends StrapiBase<ListResponse, SingleResponse> {
	constructor() {
		super('schedules');
	}

	async getMulti(fetch: Fetch, args: object = {}) {
		return super.getMulti(fetch, {
			sort: {
				start: 'asc'
			},
			...args
		});
	}
}

class StrapiScheduleDates extends StrapiBase<HeadListResponse, HeadSingleResponse> {
	constructor() {
		super('schedule-dates');
	}

	async get(fetch: Fetch, id: number | string, args: object = {}) {
		return super.get(fetch, id, args);
	}

	async getMulti(fetch: Fetch, args: object = {}) {
		return super.getMulti(fetch, {
			sort: {
				date: 'asc'
			},
			...args
		});
	}
}

export const apiSchedules = new StrapiSchedules();
export const apiScheduleDates = new StrapiScheduleDates();
