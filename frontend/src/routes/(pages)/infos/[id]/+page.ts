import type { PageLoad } from './$types';
import { apiInfos } from '$lib/api';

export const load = (async ({ params, fetch }) => {
	const info = apiInfos.get(fetch, params.id);
	return {
		info
	};
}) satisfies PageLoad;
