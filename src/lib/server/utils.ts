import { parse } from 'csv-parse/sync';
import fs from 'node:fs';

export function parseCsv(csvFile: string) {
	return parse(fs.readFileSync(csvFile).toString(), {
		columns: true
	});
}

export function findByHead(csvFile: string, head: string) {
	const buffer = fs.readFileSync(csvFile).toString();
	const lines = buffer.split('\n');
	const data = lines.find((line) => line.startsWith(head));
	if (data) {
		return parse(lines[0] + '\n' + data, { columns: true })[0];
	}
	return undefined;
}
