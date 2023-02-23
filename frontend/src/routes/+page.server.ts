import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async () => {
	// 最新インフォメーション
	const latestInfo = await prisma.info.findFirst({
		orderBy: {
			updated_at: 'desc'
		}
	});

	// 直近のスケジュール5件
	const rows = await prisma.schedule.findMany({
		take: 5,
		orderBy: {
			date: 'asc'
		},
		where: {
			date: {
				gte: new Date()
			}
		},
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

	return {
		latestInfo,
		schedules
	};
}) satisfies PageServerLoad;
