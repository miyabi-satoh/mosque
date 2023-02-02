import { apiLinks } from '$lib/api/links';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const links = await apiLinks.getMulti(fetch);
	return {
		links: links
	};
}) satisfies PageLoad;
