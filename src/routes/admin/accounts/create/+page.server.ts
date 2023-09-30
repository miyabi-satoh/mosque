import { fail } from '@sveltejs/kit';

import { UserRole } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { PROVIDERID_USERNAME } from '$lib/consts';
import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';

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

export const load = (async () => {
	const form = await superValidate(schema);

	return { form, csvHeader };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, schema);
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
					await auth.createUser({
						key: {
							providerId: PROVIDERID_USERNAME,
							providerUserId: user.code.toLowerCase(),
							password: user.code
						},
						attributes: {
							username: user.code,
							fullName: user.fullName,
							role: UserRole.USER,
							displayName: null,
							email: null,
							code: user.code
						}
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
