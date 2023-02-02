import type { PageLoad } from './$types';
import { apiInfos } from '$lib/api';

export const load = (async ({ fetch }) => {
	const info = await apiInfos.getLatest(fetch);
	return {
		info
	};
}) satisfies PageLoad;
