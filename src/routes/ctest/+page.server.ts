import { CTEST_MEDIA_CSV } from '$env/static/private';

import { parseCsv } from '$lib/server/utils';

import type { PageServerLoad } from './$types';

type CTestMediaT = {
	year: string;
	grade: string;
	month: string;
	subj: string;
	path: string;
};

export const load = (async () => {
	const csvData: CTestMediaT[] = parseCsv(CTEST_MEDIA_CSV);
	const grades = new Map<string, string>();
	const gradeSet = new Set<number>();
	csvData.forEach((obj) => gradeSet.add(Number(obj.grade)));
	[...gradeSet].sort().forEach((g) => {
		if (g === 7 || g === 8 || g === 9) {
			grades.set(`${g}`, `中${Number(g) - 6}`);
		}
	});

	return {
		csvData,
		grades
	};
}) satisfies PageServerLoad;
