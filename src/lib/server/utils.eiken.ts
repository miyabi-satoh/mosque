import fs from 'node:fs';
import { parse } from 'csv-parse/sync';
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

export function findMediaData(key: string): EikenMediaT[] | EikenMediaT | undefined {
	const buffer = fs.readFileSync(EIKEN_MEDIA_CSV).toString();
	const data = buffer.split('\n').find((line) => line.startsWith(key));
	if (data) {
		if (data.length === 0) {
			return parse(data, { columns: columnKeys })[0];
		} else {
			return parse(data, { columns: columnKeys });
		}
	}
	return undefined;
}
