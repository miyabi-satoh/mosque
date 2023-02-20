import { format, parse } from 'date-fns';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { normalizeNumber, normalizeSearch } from '$lib/utils';
import { prisma } from '$lib/server/prisma';

const pageSize = 10;

function dateString(dateStr: string, defaultDate: Date | null = null) {
	const fmt = 'yyyy-MM-dd';
	try {
		return format(parse(dateStr, fmt, new Date()), fmt);
	} catch (err) {
		return defaultDate ? format(defaultDate, fmt) : '';
	}
}

export const load = (async ({ url }) => {
	if (!url.searchParams.get('p')) {
		throw redirect(302, `${url.pathname}?p=1`);
	}

	// console.log(`load @ frontend/src/routes/(pages)/schedules/+page.ts`);
	const queryPage = normalizeNumber(url.searchParams.get('p'), 1);
	const querySearch = url.searchParams.get('q') ?? '';
	const queyStartDate = url.searchParams.get('s') ?? '';
	const queryEndDate = url.searchParams.get('e') ?? '';

	let keywords = {};
	normalizeSearch(querySearch)
		.split(' ')
		.filter((term) => term)
		.forEach((term) => {
			keywords = {
				...keywords,
				keyword: {
					contains: term,
					mode: 'insensitive'
				}
			};
		});

	const startDate = dateString(queyStartDate, new Date());
	const endDate = dateString(queryEndDate);
	let whereDate = {
		gte: new Date(startDate)
	};
	if (endDate) {
		whereDate = {
			...whereDate,
			lte: new Date(endDate)
		} as never;
	}

	const where = {
		date: {
			...whereDate
		},
		schedules_events_links: {
			every: {
				...keywords
			}
		}
	};
	const count = await prisma.schedule.count({ where });
	const rows = await prisma.schedule.findMany({
		skip: (queryPage - 1) * pageSize,
		take: pageSize,
		orderBy: {
			date: 'asc'
		},
		where,
		include: {
			schedules_events_links: {
				include: {
					events: true
				}
			}
		}
	});

	const schedules = rows.map((row) => {
		return {
			...row,
			events: row.schedules_events_links.map((r) => r.events)
		};
	});

	// console.log(result);

	return {
		queryPage,
		querySearch,
		queyStartDate: startDate,
		queryEndDate,
		schedules,
		pageSize,
		count
	};
}) satisfies PageServerLoad;
