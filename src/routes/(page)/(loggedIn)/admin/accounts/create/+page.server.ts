import { fail } from '@sveltejs/kit';

import { parse } from 'csv-parse/sync';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';
import { createUser } from '$lib/server/lucia';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	csv: z.string().min(1)
});

// unique code, full name(space separeted)
const csvHeader = ['code', 'fullName'].join(',');
type UserPropT = {
	code: string;
	fullName: string;
};

export const load = (async ({ parent }) => {
	const data = await parent();
	data.breadcrumbs.push({ label: 'Create', link: URLS.ADMIN_ACCOUNTS_CREATE });

	const form = await superValidate(zod(schema));

	return {
		form,
		csvHeader
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		// validate form data
		const formData = await request.formData();
		const form = await superValidate(formData, zod(schema));
		if (!form.valid) {
			return fail(400, { form });
		}

		// sanitize
		const data = form.data.csv.replaceAll('\r', '').replaceAll('　', '');

		try {
			const users: UserPropT[] = parse(`${csvHeader}\n${data}`, {
				skipEmptyLines: true,
				columns: true
			});
			let count = 0;
			for (const user of users) {
				// check whether the user exists or not
				const found = await db.user.findFirst({
					where: { code: user.code }
				});
				if (!found) {
					// new user
					// use code for username, password
					// (initial password is same as username)
					await createUser(user.code, user.code, {
						fullName: user.fullName,
						code: user.code
					});
					count++;
				}
			}

			return message(form, `Created ${count} account(s).`);
		} catch (e) {
			console.log(e);
			return message(form, 'An error occurred.', {
				status: 400
			});
		}
	}
};
