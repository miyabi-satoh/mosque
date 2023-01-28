import { strapiUrl } from '$lib/utils';
import type { IFormat, IStrapiFormat } from '$models/interfaces';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const res = await fetch(strapiUrl(`formats/?sort=order:desc`));
	const json = await res.json();
	if (json.error) {
		// console.log(json);
		throw new Error(json.error.message);
	}

	const data = json.data as IStrapiFormat[];
	const formats = data.map((format) => {
		return {
			id: format?.id,
			title: format?.attributes?.title,
			description: format?.attributes?.description
		} as IFormat;
	});
	return { formats };
}) satisfies PageLoad;
