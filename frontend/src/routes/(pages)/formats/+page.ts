import type { PageLoad } from './$types';
import { apiFormats } from '$lib/api';

export const load = (async ({ fetch }) => {
	// console.log(`load @ frontend/src/routes/(pages)/formats/+page.ts`);
	const formats = await apiFormats.getMulti(fetch);
	return { formats };
}) satisfies PageLoad;
