import type { PageLoad } from './$types';
import { updatePage } from './paginate';
import { apiSchedules } from '$lib/api';

export const load = (async ({ url, fetch }) => {
	// console.log(`load @ frontend/src/routes/(pages)/schedules/+page.ts`);
	const schedules = await updatePage(fetch, url.searchParams);
	for (const schedule of schedules.stateSchedules) {
		console.log(schedule);
		schedule.attributes.schedules = await apiSchedules.getMulti(fetch, {
			filters: {
				schedule_dates: {
					id: {
						$eq: schedule.id
					}
				}
			}
		});
	}

	// console.log(schedules);

	return {
		schedules
	};
}) satisfies PageLoad;
