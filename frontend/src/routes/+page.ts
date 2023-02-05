import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { apiInfos } from '$lib/api';

export const load = (async ({ fetch }) => {
	try {
		const info = await apiInfos.getLatest(fetch);
		return {
			info
		};
	} catch (err) {
		throw error(500, 'Internal Error @ RootPage');
	}
}) satisfies PageLoad;
