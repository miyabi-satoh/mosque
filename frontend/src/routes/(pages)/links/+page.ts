import type { PageLoad } from './$types';
import { updatePage } from './paginate';

export const load = (async ({ url, fetch }) => {
	// console.log(`load @ frontend/src/routes/(pages)/links/+page.ts`);
	const links = await updatePage(fetch, url.searchParams);
	return {
		links
	};
}) satisfies PageLoad;
