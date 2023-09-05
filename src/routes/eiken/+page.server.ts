import { EIKEN_MEDIA_CSV } from '$env/static/private';

import { parseCsv } from '$lib/server/utils';

import type { PageServerLoad } from './$types';

type EikenMediaT = {
	year: string;
	kai: string;
	grade: string;
	type: string;
	path: string;
};

export const load = (async () => {
	const csvData: EikenMediaT[] = parseCsv(EIKEN_MEDIA_CSV);
	const grades = new Map<string, string>();
	const gradeSet = new Set<number>();
	csvData.forEach((obj) => {
		if (obj.grade.includes('P')) {
			gradeSet.add(Number(obj.grade.replace('P', '')) + 0.5);
		} else {
			gradeSet.add(Number(obj.grade));
		}
	});
	[...gradeSet]
		.sort((a, b) => a - b)
		.forEach((grade) => {
			let g = `${grade}`;
			let pKey = '';
			let pVal = '';
			if (Math.floor(grade) != grade) {
				g = `${Math.floor(grade)}`;
				pKey = 'P';
				pVal = '準';
			}
			grades.set(`${pKey}${g}`, `${pVal}${g}級`);
		});

	return {
		csvData,
		grades
	};
}) satisfies PageServerLoad;
