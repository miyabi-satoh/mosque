import { strapiUrl } from '$lib/utils';
import type { IFormat } from '$models/interfaces';
import type { PageServerLoad } from './$types';

interface IPageFetchData {
	formats: IFormat[];
}

const defaultData: IPageFetchData = {
	formats: []
};

export const load = (async ({ fetch }): Promise<IPageFetchData> => {
	try {
		const res = await fetch(strapiUrl(`formats/?sort=order:desc`));
		const json = await res.json();
		if (json.error) {
			console.log(json);
			throw new Error(json.error.message);
		}

		const links = json.data as IFormat[];
		return { formats: links };
	} catch (err) {
		console.log(err);
	}
	return defaultData;
}) satisfies PageServerLoad<IPageFetchData>;
