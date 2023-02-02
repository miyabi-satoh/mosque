import type { PageLoad } from './$types';
import { apiLinks } from '$lib/api';

export const load = (async ({ fetch }) => {
	const links = await apiLinks.getMulti(fetch);
	return {
		links: links
	};
}) satisfies PageLoad;
