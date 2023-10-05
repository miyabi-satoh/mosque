import { db } from '$lib/server/db';

import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const data = await parent();

	const users = await db.user.findMany({
		orderBy: { username: 'asc' }
	});
	return {
		users,
		breadcrumbs: data.breadcrumbs
	};
}) satisfies PageServerLoad;
