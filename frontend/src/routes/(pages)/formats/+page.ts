import { strapiUrl } from '$lib/utils';
import type { IStrapiFormat } from '$models/interfaces';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const res = await fetch(strapiUrl(`formats/?sort=order:desc`));
	const json = await res.json();
	if (json.error) {
		throw new Error(json.error.message);
	}

	const formats = json.data as IStrapiFormat[];
	return { formats };
}) satisfies PageLoad;
