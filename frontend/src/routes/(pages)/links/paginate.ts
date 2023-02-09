import { apiLinks } from '$lib/api';
import type { Fetch } from '$lib/api/utils';
import { normalizeSearch } from '$lib/utils';
import type { IStrapiLinkQuery } from '$models/interfaces';

const pageSize = 10;
const pageRange = 2;

export async function updatePage(fetch: Fetch, params: URLSearchParams) {
	const stateCurrentPageNumber = Number(params.get('p')) || 1;
	const stateSearchTerm = params.get('q') || '';
	const stateFor = params.get('f') || '';

	let objQuery: IStrapiLinkQuery = {};
	const terms = normalizeSearch(stateSearchTerm).split(' ');
	terms.forEach((term) => {
		const obj = {
			keyword: {
				$containsi: term
			}
		};
		if (!objQuery.filters) {
			objQuery.filters = {};
		}
		if (!objQuery.filters['$and']) {
			objQuery.filters['$and'] = [] as never;
		}
		objQuery.filters['$and'] = [...objQuery.filters['$and'], obj] as never;
	});
	const objFor: IStrapiLinkQuery = {};
	if (stateFor) {
		objFor.filters = {};
		objFor.filters[stateFor] = {
			$eq: true
		} as never;
	}

	if (objQuery.filters && objFor.filters) {
		objQuery.filters['$and'] = [objFor.filters, ...objQuery.filters['$and']] as never;
	} else if (objFor.filters) {
		objQuery.filters = { ...objFor.filters };
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
