import type { Fetch } from '$lib/api/utils';
import { apiScheduleDates } from '$lib/api';
import { normalizeSearch } from '$lib/utils';
import type { IStrapiQuery } from '$lib/api/strapiBase';

const pageSize = 10;
const pageRange = 2;

export async function updatePage(fetch: Fetch, params: URLSearchParams) {
	const stateCurrentPageNumber = Number(params.get('p')) || 1;
	const stateStartDate = params.get('s') || '';
	const stateEndDate = params.get('e') || '';
	const stateSearchTerm = params.get('q') || '';

	let filters = [];
	filters = normalizeSearch(stateSearchTerm)
		.split(' ')
		.filter((term) => term)
		.map((term) => {
			return {
				schedules: {
					keyword: {
						$contains: term
					}
				}
			};
		});

	if (stateStartDate) {
		filters = [
			...filters,
			{
				date: {
					$gte: stateStartDate
				}
			}
		];
	}
	if (stateEndDate) {
		filters = [
			...filters,
			{
				date: {
					$lte: stateEndDate
				}
			}
		];
	}

	let objQuery = {} as IStrapiQuery;
	if (filters.length > 0) {
		objQuery = {
			filters: {
				$and: filters
			} as never
		};
	}
	objQuery = {
		...objQuery,
		'pagination[page]': stateCurrentPageNumber,
		'pagination[pageSize]': pageSize
	};
	const json = await apiScheduleDates.getMulti(fetch, objQuery);
	const stateSchedules = json.data;
	const stateMeta = json.meta;
	const pageCount = stateMeta?.pagination?.pageCount || 0;

	// ページャー
	// 現在位置からの前後nページを表示
	let start = 0;
	let end = 0;
	if (pageCount <= pageRange * 2 + 1) {
		start = 1;
		end = pageCount;
	} else {
		start = Math.max(stateCurrentPageNumber - pageRange, 1);
		end = Math.min(start + pageRange * 2, pageCount);
		if (end == pageCount) {
			start = pageCount - pageRange * 2;
		}
	}

	const statePages = [];
	for (let i = start; i <= end; i++) {
		statePages.push({
			name: `${i}`,
			href: `/schedules?p=${i}&q=${stateSearchTerm}&s=${stateStartDate}&e=${stateEndDate}`,
			active: i == stateCurrentPageNumber
		});
	}

	return {
		stateSchedules,
		stateMeta,
		statePages
	};
}
