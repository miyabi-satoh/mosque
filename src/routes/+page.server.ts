import { loadCTestMediaData } from '$lib/server/utils';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const csvData = loadCTestMediaData();
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
