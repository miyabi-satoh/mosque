import type { PageLoad } from './$types';
import { apiFormats } from '$lib/api';

export const load = (async ({ fetch }) => {
	const formats = await apiFormats.getMulti(fetch);
	return { formats };
}) satisfies PageLoad;
