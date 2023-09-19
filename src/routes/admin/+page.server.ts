import { db } from '$lib/server/db';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const exam = await db.exam.findMany({
		orderBy: { sortOrder: 'asc' }
	});

	return {
		exam
	};
};
