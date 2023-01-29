import { strapiUrl } from '$lib/utils';
import type { ILink, IStrapiLink } from '$models/interfaces';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const res = await fetch(strapiUrl(`links/?sort=order:desc`));
	const json = await res.json();
	if (json.error) {
		throw new Error(json.error.message);
	}

	const links = json.data.map((data: IStrapiLink) => {
		return {
			id: data?.id,
			url: data?.attributes?.url,
			title: data?.attributes?.title,
			description: data?.attributes?.description
		} as ILink;
	});

	return {
		links
	};
}) satisfies PageLoad;
