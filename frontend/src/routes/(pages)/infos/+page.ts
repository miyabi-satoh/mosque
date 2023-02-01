import { strapiUrl } from '$lib/utils';
import type { IStrapiInfo } from '$models/interfaces';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const res = await fetch(strapiUrl(`infos/?sort=updatedAt:desc`));
	if (res.ok) {
		const json = await res.json();
		return {
			infos: json.data as IStrapiInfo[]
		};
	}

	throw error(404, 'error');
}) satisfies PageLoad;
