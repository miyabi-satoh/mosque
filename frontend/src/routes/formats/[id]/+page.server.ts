import { strapiUrl } from '$lib/utils';
import type { IFormat } from '$models/interfaces';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

interface IPageFetchData {
	format: IFormat;
}

export const load = (async ({ params, fetch }): Promise<IPageFetchData> => {
	try {
		const res = await fetch(strapiUrl(`formats/${params.id}`));
		const json = await res.json();
		console.log(json);
		if (json.error) {
			throw new Error(json.error.message);
		}

		const format = json.data as IFormat;
		return { format };
	} catch (err) {
		console.log(err);
	}

	throw error(404, 'Not found');
}) satisfies PageServerLoad<IPageFetchData>;
