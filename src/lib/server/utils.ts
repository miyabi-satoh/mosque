import { parse } from 'csv-parse/sync';
import fs from 'node:fs';

function readCsv(csvFile: string) {
	const buffer = fs
		.readFileSync(csvFile)
		.toString()
		.replace(/\r?\n|\r/g, '\n');
	return buffer;
}

export function parseCsv(csvFile: string) {
	return parse(readCsv(csvFile), {
		columns: true
	});
}

export function findByHead(csvFile: string, head: string) {
	const buffer = readCsv(csvFile);
	const lines = buffer.split('\n');
	const data = lines.find((line) => line.startsWith(head));
	if (data) {
		// console.log(head);
		// console.log(data);
		return parse(lines[0] + '\n' + data, { columns: true })[0];
	}
	return undefined;
}
