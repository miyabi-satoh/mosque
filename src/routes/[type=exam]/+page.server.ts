import { error } from '@sveltejs/kit';

import type { ExamTypeEnum } from '@prisma/client';

import { db } from '$lib/server/db';
import { exclude } from '$lib/utils';

import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const examType = params.type.toLowerCase() as ExamTypeEnum;
	const exam = await db.exam.findUnique({ where: { examType: examType } });
	if (!exam) {
		console.error(`Cannot read exam(examType = '${examType}')`);
		throw error(500, 'Internal Server Error');
	}

	const resources = await db.resource.findMany({
		where: { examType },
		orderBy: [{ year: 'desc' }, { numOf: 'desc' }, { grade: 'asc' }, { category: 'asc' }]
	});

	// const config = getExamConfig(exam);
	// const csvData = resources.map((data) => {
	// 	return {
	// 		id: data.id,
	// 		year: { label: config.labelYear(data.year), value: data.year },
	// 		numOf: { label: config.labelNumOf(data.numOf), value: data.numOf },
	// 		grade: { label: config.labelGrade(data.grade), value: data.grade },
	// 		category: data.category,
	// 		title: data.title
	// 	};
	// });

	return {
		csvData: resources.map((r) => exclude(r, ['examType', 'path', 'shortTitle'])),
		exam
	};
}) satisfies PageServerLoad;
