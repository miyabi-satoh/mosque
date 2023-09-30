import { fail } from '@sveltejs/kit';

import { UserRole, type User } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import { format } from 'date-fns';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { PROVIDERID_USERNAME } from '$lib/consts';
import { db } from '$lib/server/db';
import { auth } from '$lib/server/lucia';
import { exclude } from '$lib/utils';

import type { Actions, PageServerLoad } from './$types';

const schema = z.object({
	csv: z.string().min(1)
});
const csvHeader = ['username', 'fullName', 'birthday'].join(',');
type UserPropT = Pick<User, 'fullName' | 'username'> & {
	birthday: string;
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
				const found = await db.user.findFirst({
					where: { code: user.username }
				});
				if (!found) {
					await auth.createUser({
						key: {
							providerId: PROVIDERID_USERNAME,
							providerUserId: user.username.toLowerCase(),
							password: format(new Date(user.birthday), 'yyyyMMdd')
						},
						attributes: {
							...exclude(user, ['birthday']),
							role: UserRole.USER,
							displayName: null,
							email: null,
							code: user.username
						}
					});
					count++;
				}
			}

			return message(form, `Created ${count} account(s).`);
		} catch (e) {
			console.log(e);
			return fail(400, { form: { ...form, message: 'エラー' } });
		}
	}
};
