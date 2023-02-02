import type { PageLoad } from './$types';
import { apiInfos } from '$lib/api';

export const load = (async ({ fetch }) => {
	const infos = await apiInfos.getMulti(fetch);
	return {
		infos
	};
}) satisfies PageLoad;
