import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { apiLinks } from '$lib/api';
import { buildPageQuery, normalizeSearch } from '$lib/utils';

const pageSize = 2;

export const load = (async ({ url, fetch }) => {
	if (!url.searchParams.get('p')) {
		throw redirect(302, `${url.pathname}?p=1`);
	}

	// console.log('load @ frontend/src/routes/(pages)/links/+page.ts');
	const queryPage = (() => {
		const num = Number(url.searchParams.get('p') ?? 1);
		return isNaN(num) ? 1 : Math.max(1, num);
	})();
	const querySearch = url.searchParams.get('q') ?? '';
	const queryFor = url.searchParams.get('f') ?? '';

	let filters = [];
	filters = normalizeSearch(querySearch)
		.split(' ')
		.filter((term) => term)
		.map((term) => {
			return {
				keyword: {
					$containsi: term
				}
			};
		});

	if (queryFor) {
		const obj: Record<string, never> = {};
		obj[queryFor] = {
			$eq: true
		} as never;
		filters.push(obj as never);
	}

	const objQuery = buildPageQuery(filters, queryPage, pageSize);
	const links = await apiLinks.getMulti(fetch, objQuery);
	return {
		queryPage,
		querySearch,
		queryFor,
		links
	};
}) satisfies PageLoad;
