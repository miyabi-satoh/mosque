import type { PageLoad } from './$types';
import { updatePage } from './paginate';

export const load = (async ({ url, fetch }) => {
	const links = await updatePage(fetch, url.searchParams);
	return {
		links
	};
}) satisfies PageLoad;
