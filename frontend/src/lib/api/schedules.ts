import { StrapiBase, type IStrapiQuery } from './strapiBase';
import type { Fetch } from './utils';
import type { DeepNonNullable } from '$models/interfaces';
import type { paths } from '$models/strapi_schemas';

type SingleResponse = DeepNonNullable<
	paths['/schedules/{id}']['get']['responses']['200']['content']['application/json']
>;
type ListResponse = DeepNonNullable<
	paths['/schedules']['get']['responses']['200']['content']['application/json']
>;

class StrapiSchedules extends StrapiBase<ListResponse, SingleResponse> {
	constructor() {
		super('schedules');
	}

	async getMulti(fetch: Fetch, query: IStrapiQuery = {}) {
		return super.getMulti(fetch, {
			sort: 'start:asc',
			...query
		});
	}
}

type DateSingleResponse = DeepNonNullable<
	paths['/schedule-dates/{id}']['get']['responses']['200']['content']['application/json']
>;
type DateListResponse = DeepNonNullable<
	paths['/schedule-dates']['get']['responses']['200']['content']['application/json']
>;

class StrapiScheduleDates extends StrapiBase<DateListResponse, DateSingleResponse> {
	constructor() {
		super('schedule-dates');
	}

	async get(fetch: Fetch, id: number | string, args: object = {}) {
		return super.get(fetch, id, args);
	}

	async getMulti(fetch: Fetch, query: IStrapiQuery = {}) {
		return super.getMulti(fetch, {
			sort: 'date:asc',
			...query
		});
	}
}

export const apiSchedules = new StrapiSchedules();
export const apiScheduleDates = new StrapiScheduleDates();
