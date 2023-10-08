import { readFileSync } from 'node:fs';

import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
	let svg = readFileSync('/Users/masayuki/Documents/A4 - 1.svg').toString();
	svg = svg
		.replaceAll('%fullname%', 'hogehoge')
		.replaceAll('%login_id%', 'fugafuga')
		.replaceAll('font-family="Myrica M"', 'font-family="sans-serif"');
	return {
		svg
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async () => {}
};
