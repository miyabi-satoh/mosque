import { strapiUrl } from '$lib/utils';
import type { IFormat, IStrapiFormat } from '$models/interfaces';
import type { PageLoad } from './$types';

export const load = (async ({ params, fetch }) => {
	const res = await fetch(strapiUrl(`formats/${params.id}`));
	const json = await res.json();
	// console.log(json);
	if (json.error) {
		throw new Error(json.error.message);
	}

	const data = json.data as IStrapiFormat;
	const format = {
		id: data?.id,
		title: data?.attributes?.title,
		description: data?.attributes?.description
	} as IFormat;

	return {
		format
	};
}) satisfies PageLoad;
