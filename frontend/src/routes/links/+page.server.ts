import { strapiUrl } from '$lib/utils';
import type { ILink } from '$models/interfaces';
import type { PageServerLoad } from './$types';

interface IPageFetchData {
	links: ILink[];
}

const defaultData: IPageFetchData = {
	links: []
};

export const load = (async ({ fetch }): Promise<IPageFetchData> => {
	try {
		const res = await fetch(strapiUrl(`links`));
		const json = await res.json();
		if (json.error) {
			console.log(json);
			throw new Error(json.error.message);
		}

		const links = json.data as ILink[];
		return { links };
	} catch (err) {
		console.log(err);
	}
	return defaultData;
}) satisfies PageServerLoad<IPageFetchData>;
