import { parse } from 'csv-parse/sync';
import fs from 'node:fs';

import { EIKEN_MEDIA_CSV } from '$env/static/private';

type EikenMediaT = {
	year: string;
	kai: string;
	grade: string;
	type: string;
	path: string;
};

const columnKeys = ['year', 'kai', 'grade', 'type', 'path'];

export function loadEikenMediaData(): EikenMediaT[] {
	return parse(fs.readFileSync(EIKEN_MEDIA_CSV).toString(), {
		columns: () => columnKeys
	});
}

export function findMediaData(key: string): EikenMediaT | undefined {
	const buffer = fs.readFileSync(EIKEN_MEDIA_CSV).toString();
	const data = buffer.split('\n').find((line) => line.startsWith(key));
	if (data) {
		return parse(data, { columns: columnKeys })[0];
	}
	return undefined;
}
