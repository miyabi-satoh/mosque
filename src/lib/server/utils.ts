import { ExamType, type Exam, type Resource } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

import { CTEST_RESOURCE_DIR, EIKEN_RESOURCE_DIR } from '$env/static/private';

import { categories } from '$lib/consts';

export function searchFiles(dirPath: string, ext: RegExp) {
	// console.log(dirPath);
	const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });

	const files: string[] = [];
	for (const dirent of allDirents) {
		if (dirent.isDirectory()) {
			const subDirPath = path.join(dirPath, dirent.name);
			files.push(...searchFiles(subDirPath, ext));
		} else if (dirent.isFile()) {
			if (dirent.name.match(ext)) {
				files.push(path.join(dirPath, dirent.name));
			}
		}
	}

	return files;
}

type ValueGradeFunc = (grade: number, opt: string) => number;
export function getExamConfig(exam: Exam) {
	const labelYear = (year: number) => `${year}年度`;

	if (exam.examType === ExamType.ctest) {
		return {
			baseDir: CTEST_RESOURCE_DIR,
			headers: [
				{ label: '年度', classOpt: 'w-[5.5em]' },
				{ label: exam.labelNumOf, classOpt: 'w-[4em]' },
				{ label: exam.labelGrade, classOpt: 'w-[4em]' },
				{ label: '種類', classOpt: 'w-[6em]' },
				{ label: 'パス', classOpt: 'flex-1' }
			],
			labelYear,
			labelNumOf: (numOf: number) => `${numOf}月号`,
			labelGrade: (grade: number) => `中${grade - 6}`,
			valueGrade: (grade: number, opt: string) => (opt === '中' ? grade + 6 : grade),
			parse: (filename: string, valueGrade: ValueGradeFunc) => {
				const retObj = {} as Resource;

				const m = filename.match(
					/^(?<year>\d{4})(?<g>(小|中))(?<grade>\d)_(?<numOf>\d\d)_\d\d(?<subj>(国語|英語)).mp3$/
				);
				if (m && m.groups) {
					const category = m.groups.subj === '英語' ? categories.enOngen : categories.jaOngen;
					retObj.year = Number(m.groups.year);
					retObj.numOf = Number(m.groups.numOf);
					retObj.grade = valueGrade(Number(m.groups.grade), m.groups.g);
					retObj.category = category.value;
					retObj.title = category.label;
					retObj.shortTitle = category.shortLabel ?? category.label;
					return retObj;
				}
				return retObj;
			}
		};
	} else {
		return {
			baseDir: EIKEN_RESOURCE_DIR,
			headers: [
				{ label: '年度', classOpt: 'w-[5.5em]' },
				{ label: exam.labelNumOf, classOpt: 'w-[4.5em]' },
				{ label: exam.labelGrade, classOpt: 'w-[4em]' },
				{ label: '種類', classOpt: 'w-[6.5em]' },
				{ label: 'パス', classOpt: 'flex-1' }
			],
			labelYear,
			labelNumOf: (numOf: number) => `第${numOf}回`,
			labelGrade: (grade: number) => {
				const p = grade % 10 === 0 ? '' : '準';
				return p + `${grade}`.slice(0, 1) + '級';
			},
			valueGrade: (grade: number, opt: string) => grade * 10 + (opt ? 5 : 0),
			parse: (filename: string, valueGrade: ValueGradeFunc) => {
				const retObj = {} as Resource;

				// 英検PDF パターン１
				{
					const m = filename.match(
						/^(?<year>\d{4})-(?<numOf>\d)(?<ji>-1ji)?-(?<p>p)?(?<grade>\d)kyu.pdf$/
					);
					if (m && m.groups) {
						const category = m.groups.ji ? categories.mondai : categories.kaitou;
						retObj.year = Number(m.groups.year);
						retObj.numOf = Number(m.groups.numOf);
						retObj.grade = valueGrade(Number(m.groups.grade), m.groups.p);
						retObj.category = category.value;
						retObj.title = category.label;
						retObj.shortTitle = category.label;
						return retObj;
					}
				}
				// 英検PDF パターン２
				{
					const m = filename.match(/^(?<p>p)?(?<grade>\d)kyu(?<sun>-sunc?)?.pdf/);
					if (m && m.groups) {
						const category = m.groups.sun ? categories.kaitou : categories.mondai;
						retObj.grade = valueGrade(Number(m.groups.grade), m.groups.p);
						retObj.category = category.value;
						retObj.title = category.label;
						retObj.shortTitle = category.label;
						return retObj;
					}
				}
				// 英検MP3
				{
					const m = filename.match(/^(?<p>p?)(?<grade>\d)q-?part(?<part>\d).mp3$/);
					if (m && m.groups) {
						const category = categories.ongen;
						const part = Number(m.groups.part);
						retObj.grade = valueGrade(Number(m.groups.grade), m.groups.p);
						retObj.category = category.value + part;
						retObj.title = category.label + `(Part${part})`;
						retObj.shortTitle = category.shortLabel + `(Part${part})`;
						return retObj;
					}
				}
				return retObj;
			}
		};
	}
}
