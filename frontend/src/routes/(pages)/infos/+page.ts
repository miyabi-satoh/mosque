import type { PageLoad } from './$types';
import { apiInfos } from '$lib/api';

export const load = (async ({ fetch }) => {
	// console.log(`load @ frontend/src/routes/(pages)/infos/+page.ts`);
	const infos = await apiInfos.getMulti(fetch);
	return {
		infos: infos
	};
}) satisfies PageLoad;
