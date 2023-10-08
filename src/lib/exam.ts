import type { Exam, TempResource } from '@prisma/client';

type ColumnKeys = keyof Pick<
	TempResource,
	'category' | 'grade' | 'numOf' | 'path' | 'publisher' | 'shortTitle' | 'title' | 'year'
>;
type ColumnLabel = {
	[key in ColumnKeys]?: string;
};

export abstract class ExamConfigBase {
	columnLabels: ColumnLabel = {};

	labelYear(year: number): string {
		return `${year}年度`;
	}
	labelNumOf(_: number): string {
		return '';
	}
	labelGrade(_: number): string {
		return '';
	}
	abstract parse(_: string): TempResource;
}

export class CTestConfig extends ExamConfigBase {
	columnLabels = {
		year: '年度',
		numOf: '月号',
		grade: '学年',
		shortTitle: '種類',
		path: 'パス'
	};
	labelNumOf(numOf: number): string {
		return `${numOf}月号`;
	}
	labelGrade(grade: number): string {
		return `中${grade - 6}`;
	}
	parse(filename: string): TempResource {
		const retObj = {} as TempResource;

		const m = filename.match(
			/^(?<year>\d{4})(?<g>(小|中))(?<grade>\d)_(?<numOf>\d\d)_\d\d(?<subj>(国語|英語)).mp3$/i
		);
		if (m && m.groups) {
			const numGrade = Number(m.groups.grade);
			retObj.year = Number(m.groups.year);
			retObj.numOf = Number(m.groups.numOf);
			retObj.grade = m.groups.g === '中' ? numGrade + 6 : numGrade;
			if (m.groups.subj === '英語') {
				retObj.category = 2;
				retObj.title = '英語 リスニング問題';
				retObj.shortTitle = '英語音源';
			} else {
				retObj.category = 1;
				retObj.title = '国語 聞き取り問題';
				retObj.shortTitle = '国語音源';
			}
			return retObj;
		}
		return retObj;
	}
}

export class EikenConfig extends ExamConfigBase {
	columnLabels = {
		year: '年度',
		numOf: '実施回',
		grade: '級',
		shortTitle: '種類',
		path: 'パス'
	};
	labelNumOf(numOf: number): string {
		return `第${numOf}回`;
	}
	labelGrade(grade: number): string {
		const p = grade % 10 === 0 ? '' : '準';
		return p + `${grade}`.slice(0, 1) + '級';
	}
	parse(filename: string): TempResource {
		const retObj = {} as TempResource;

		// 英検PDF パターン１
		{
			const m = filename.match(
				/^(?<year>\d{4})-(?<numOf>\d)(?<ji>-1ji)?-(?<p>p)?(?<grade>\d)kyu.pdf$/i
			);
			if (m && m.groups) {
				retObj.year = Number(m.groups.year);
				retObj.numOf = Number(m.groups.numOf);
				retObj.grade = Number(m.groups.grade) * 10 + (m.groups.p ? 5 : 0);
				if (m.groups.ji) {
					retObj.category = 100;
					retObj.title = '問題冊子';
					retObj.shortTitle = '問題冊子';
				} else {
					retObj.category = 200;
					retObj.title = '解答';
					retObj.shortTitle = '解答';
				}
				return retObj;
			}
		}
		// 英検PDF パターン２
		{
			const m = filename.match(/^(?<p>p)?(?<grade>\d)kyu(?<sun>-sunc?)?.pdf/i);
			if (m && m.groups) {
				retObj.grade = Number(m.groups.grade) * 10 + (m.groups.p ? 5 : 0);
				if (m.groups.sun) {
					retObj.category = 200;
					retObj.title = '解答';
					retObj.shortTitle = '解答';
				} else {
					retObj.category = 100;
					retObj.title = '問題冊子';
					retObj.shortTitle = '問題冊子';
				}
				return retObj;
			}
		}
		// 英検MP3
		{
			const m = filename.match(/^(?<p>p?)(?<grade>\d)q-?part(?<part>\d).mp3$/i);
			if (m && m.groups) {
				const part = Number(m.groups.part);
				retObj.grade = Number(m.groups.grade) * 10 + (m.groups.p ? 5 : 0);
				retObj.category = part;
				retObj.title = `リスニング音源(Part${part})`;
				retObj.shortTitle = `音源(${part})`;
				return retObj;
			}
		}
		console.log(`Unmatched ${filename}`);
		return retObj;
	}
}
class KyoteConfig extends ExamConfigBase {
	columnLabels = {
		year: '年度',
		publisher: '出版社',
		path: 'パス'
	};
	parse(filename: string): TempResource {
		const retObj = {} as TempResource;

		const m = filename.match(/.*(?<year>20\d{2}).*\.mp3$/i);
		if (m && m.groups) {
			retObj.year = Number(m.groups.year);
			retObj.numOf = 0;
			retObj.grade = 0;
			retObj.category = 0;
			retObj.title = filename;
			retObj.shortTitle = filename;

			return retObj;
		}
		return retObj;
	}
}

export function getExamConfig(exam: Exam): ExamConfigBase {
	switch (exam.examType) {
		case 'ctest':
			return new CTestConfig();
		case 'eiken':
			return new EikenConfig();
		case 'kyote':
			return new KyoteConfig();
	}
}
