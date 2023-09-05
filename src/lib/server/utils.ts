import { parse } from 'csv-parse/sync';
import fs from 'node:fs';

import { CTEST_MEDIA_CSV } from '$env/static/private';

type CTestMediaT = {
	year: string;
	grade: string;
	month: string;
	subj: string;
	path: string;
};

const columnKeys = ['year', 'grade', 'month', 'subj', 'path'];

export function loadCTestMediaData(): CTestMediaT[] {
	return parse(fs.readFileSync(CTEST_MEDIA_CSV).toString(), {
		columns: () => columnKeys
	});
}

export function findMediaData(key: string): CTestMediaT | undefined {
	const buffer = fs.readFileSync(CTEST_MEDIA_CSV).toString();
	const data = buffer.split('\n').find((line) => line.startsWith(key));
	if (data) {
		return parse(data, { columns: columnKeys })[0];
	}
	return undefined;
}
