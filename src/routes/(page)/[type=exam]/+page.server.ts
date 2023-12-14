import { error } from '@sveltejs/kit';

import type { ExamTypeEnum } from '@prisma/client';

import { db } from '$lib/server/db';
import { exclude } from '$lib/utils';

import type { PageServerLoad } from './$types';

export const load = (async ({ params, parent }) => {
	const examType = params.type.toLowerCase() as ExamTypeEnum;
	const exam = await db.exam.findUnique({ where: { examType: examType } });
	if (!exam) {
		console.error(`Cannot read exam(examType = '${examType}')`);
		throw error(500, 'Internal Server Error');
	}

	const data = await parent();
	data.breadcrumbs.push({ label: `${exam.name}アーカイブ`, link: `/${examType}` });

	const resources = await db.resource.findMany({
		where: { examType },
		orderBy: [{ year: 'desc' }, { numOf: 'desc' }, { grade: 'asc' }, { category: 'asc' }]
	});

	return {
		csvData: resources.map((r) => exclude(r, ['examType', 'path', 'shortTitle'])),
		exam
	};
}) satisfies PageServerLoad;
