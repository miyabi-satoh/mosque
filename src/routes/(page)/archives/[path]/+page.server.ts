import { error } from '@sveltejs/kit';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const archive = await db.archive.findUnique({ where: { path: params.path } });
	if (!archive) {
		return error(404, 'Archive not found');
	}

	const data = await parent();
	data.breadcrumbs.push({ label: archive.title, link: URLS.ARCHIVES(archive.path) });

	const items = await db.archiveItem.findMany({
		where: { archiveId: archive.id, published: true },
		orderBy: [{ year: 'desc' }, { section: 'desc' }, { grade: 'asc' }, { title: 'asc' }]
	});

	return { items };
};
