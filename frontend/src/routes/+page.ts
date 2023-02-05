import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { apiInfos } from '$lib/api';

export const load = (async ({ fetch }) => {
	// console.log('load @ frontend/src/routes/+page.ts');
	try {
		const latestInfo = await apiInfos.getLatestOne(fetch);
		return {
			latestInfo
		};
	} catch (err) {
		// console.log(err);
	}

	throw error(500, 'Internal Error @ RootPage');
}) satisfies PageLoad;
