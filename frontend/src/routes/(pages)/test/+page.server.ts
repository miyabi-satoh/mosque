import type { PageServerLoad } from './$types';

export const load = (async () => {
	const dummy = 'dummy';
	return {
		dummy
	};
}) satisfies PageServerLoad;
