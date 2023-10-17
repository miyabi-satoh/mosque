import { fail } from '@sveltejs/kit';

import { readFileSync } from 'node:fs';
import QRCode from 'qrcode';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { ORIGIN } from '$env/static/private';

import { db } from '$lib/server/db';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	checked: z.string(),
	svg: z.string().nullish()
});

export const load = (async () => {
	const form = await superValidate(schema);
	form.data.svg = 'No data available.';

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const imgData = await QRCode.toDataURL(ORIGIN);

		// validate form data
		const formData = await request.formData();
		const form = await superValidate(formData, schema);
		if (!form.valid) {
			return fail(400, { form });
		}

		// get selected users
		const users = await db.user.findMany({
			where: { id: { in: form.data.checked.split(',') } },
			orderBy: { username: 'asc' }
		});

		const PER_PAGE = 16;
		const template = readFileSync('./static/accounts.svg').toString();
		let svg: string = '';
		users.forEach((user, i) => {
			const idx = i % PER_PAGE;
			if (idx === 0) {
				svg += template;
			}
			svg = svg
				.replaceAll(`%url${idx}%`, ORIGIN)
				.replaceAll(`%fullname${idx}%`, user.fullName ?? '')
				.replaceAll(`%login_id${idx}%`, user.username)
				.replaceAll(`%password${idx}%`, user.username);
			const re = new RegExp(`<rect(?<attr> id="qrcode${idx}".+?)fill="#D9D9D9"/>`);
			const m = re.exec(svg);
			if (m !== null) {
				svg = svg.replace(re, `<image ${m.groups?.attr} xlink:href="${imgData}" />`);
			}
		});
		if (!svg) {
			svg = 'No data available.';
		} else {
			svg = svg
				.replaceAll(/%url\d+%/g, '')
				.replaceAll(/%fullname\d+%/g, '')
				.replaceAll(/%login_id\d+%/g, '')
				.replaceAll(/%password\d+%/g, '')
				.replaceAll('font-family="Myrica M"', 'font-family="sans-serif"');
		}
		form.data.svg = svg;

		return { form };
	}
};
