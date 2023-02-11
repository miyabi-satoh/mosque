import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const dummy = 'dummy';
	return {
		dummy
	};
}) satisfies PageLoad;
