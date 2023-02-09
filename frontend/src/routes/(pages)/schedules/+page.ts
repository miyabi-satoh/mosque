import type { PageLoad } from './$types';
import { updatePage } from './paginate';

export const load = (async ({ url, fetch }) => {
	// console.log(`load @ frontend/src/routes/(pages)/schedules/+page.ts`);
	const schedules = await updatePage(fetch, url.searchParams);
	return {
		schedules
	};
}) satisfies PageLoad;
