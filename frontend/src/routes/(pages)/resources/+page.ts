import type { PageLoad } from './$types';
import { apiResources } from '$lib/api';

export const load = (async ({ fetch }) => {
	// console.log(`load @ frontend/src/routes/(pages)/resources/+page.ts`);
	const resources = await apiResources.getMulti(fetch);
	return { resources };
}) satisfies PageLoad;
