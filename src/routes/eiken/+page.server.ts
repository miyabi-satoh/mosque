import { loadEikenMediaData } from '$lib/server/utils.eiken';

import type { PageServerLoad } from './$types';

export const load = (async () => {
	const csvData = loadEikenMediaData();
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
