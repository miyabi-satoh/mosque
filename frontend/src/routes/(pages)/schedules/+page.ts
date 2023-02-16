import { format, parse } from 'date-fns';
import type { PageLoad } from './$types';
import { apiScheduleDates } from '$lib/api';
import { buildPageQuery, normalizeSearch } from '$lib/utils';

const pageSize = 10;

function dateString(dateStr: string, defaultDate: Date | undefined = undefined) {
	const fmt = 'yyyy-MM-dd';
	try {
		return format(parse(dateStr, fmt, new Date()), fmt);
	} catch (err) {
		if (defaultDate) {
			return format(defaultDate, fmt);
		}
		return '';
	}
}

export const load = (async ({ url, fetch }) => {
	// console.log(`load @ frontend/src/routes/(pages)/schedules/+page.ts`);
	const queryPage = (() => {
		const num = Number(url.searchParams.get('p') ?? 1);
		return isNaN(num) ? 1 : Math.max(1, num);
	})();
	const querySearch = url.searchParams.get('q') ?? '';
	const queyStartDate = url.searchParams.get('s') ?? '';
	const queryEndDate = url.searchParams.get('e') ?? '';

	let filters = [];
	filters = normalizeSearch(querySearch)
		.split(' ')
		.filter((term) => term)
		.map((term) => {
			return {
				schedules: {
					keyword: {
						$containsi: term
					}
				}
			};
		});

	const start = dateString(queyStartDate, new Date());
	filters.push({
		date: {
			$gte: start
		}
	} as never);

	const end = dateString(queryEndDate);
	if (end) {
		filters.push({
			date: {
				$lte: end
			}
		} as never);
	}

	const objQuery = buildPageQuery(filters, queryPage, pageSize);
	const schedules = await apiScheduleDates.getMulti(fetch, objQuery);

	// console.log(schedules);

	return {
		queryPage,
		querySearch,
		queyStartDate: start,
		queryEndDate,
		schedules
	};
}) satisfies PageLoad;
