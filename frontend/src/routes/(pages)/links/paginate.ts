import { apiLinks } from '$lib/api';
import { normalizeSearch } from '$lib/utils';
import type { Fetch, IStrapiQuery } from '$schemas';

const pageSize = 10; // 1ページに表示する件数
const pageRange = 2; // ページャーに表示する前後のページ数

export async function updatePage(fetch: Fetch, params: URLSearchParams) {
	const stateCurrentPageNumber = Number(params.get('p')) || 1;
	const stateSearchTerm = params.get('q') || '';
	const stateFor = params.get('f') || '';

	let filters = [];
	filters = normalizeSearch(stateSearchTerm)
		.split(' ')
		.filter((term) => term)
		.map((term) => {
			return {
				keyword: {
					$contains: term
				}
			};
		});

	if (stateFor) {
		filters = [
			...filters,
			{
				stateFor: {
					$eq: true
				}
			}
		];
	}

	let objQuery = {} as IStrapiQuery;
	if (filters.length > 0) {
		objQuery = {
			filters: {
				$and: filters
			}
		} as never;
	}

	objQuery = {
		...objQuery,
		'pagination[page]': stateCurrentPageNumber,
		'pagination[pageSize]': pageSize
	};
	const json = await apiLinks.getMulti(fetch, objQuery);
	const stateLinks = json.data;
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
			href: `/links?p=${i}&q=${stateSearchTerm}&f=${stateFor}`,
			active: i == stateCurrentPageNumber
		});
	}

	return {
		stateLinks,
		stateMeta,
		statePages
	};
}
