import { redirect } from '@sveltejs/kit';
import type { User } from '@prisma/client';
import { ValidationError } from 'yup';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { exclude, requestToObject, validationErrorToAssoc, normalizeNumber } from '$lib/utils';
import type { UserCreate, UserPostErrors, UserUpdate } from '$lib/user';
import { createUser, updateUser } from '$lib/server/user';

const pageSize = 10;
export const load = (async ({ url }) => {
	console.log(`/routes/(pages)/admin/users/+page.server.ts`);

	if (!url.searchParams.get('p')) {
		throw redirect(302, `${url.pathname}?p=1&q=`);
	}

	const queryPage = normalizeNumber(url.searchParams.get('p'), 1);
	const querySearch = url.searchParams.get('q') ?? '';

	const keywords: object[] = [];
	decodeURIComponent(querySearch)
		.replaceAll('　', ' ')
		.replace(/ +/g, ' ')
		.split(' ')
		.filter((term) => term)
		.forEach((term) => {
			keywords.push({
				keyword: {
					contains: term,
					mode: 'insensitive'
				}
			});
		});

	const where = {
		AND: keywords
	};
	console.log(where);
	const count = await prisma.user.count({ where });
	const users = await prisma.user.findMany({
		skip: (queryPage - 1) * pageSize,
		take: pageSize,
		orderBy: [
			{
				id: 'asc'
			}
		],
		where
	});

	return {
		queryPage,
		querySearch,
		users: users.map((user) => exclude(user, ['password', 'token'])) as User[],
		pageSize,
		count
	};
}) satisfies PageServerLoad;

type FormData = {
	json: string;
};

type ActionResult = {
	success?: boolean;
	message?: string;
	errors?: UserPostErrors;
};

export const actions: Actions = {
	default: async ({ request }): Promise<ActionResult> => {
		console.log(`POST /routes/(pages)/admin/users/+page.server.ts`);
		const success = true;
		const formData = await requestToObject<FormData>(request);
		const users = JSON.parse(formData.json) as UserUpdate[];
		let progress = 0;
		let created = 0;
		let updated = 0;
		for (const user of users) {
			progress++;

			try {
				if (user.id) {
					const _user = await updateUser(user.id, user);
					updated++;
				} else {
					const _user = await createUser(user as UserCreate);
					created++;
				}
			} catch (err) {
				if (err instanceof ValidationError) {
					const message = `${progress}件目の入力データに不備があります。`;
					const errors = validationErrorToAssoc(err);
					return { message, errors };
				} else if (err instanceof Error) {
					const message = err.message;
					return { message };
				}
			}
		}

		const message = [
			`${progress}件のデータを処理しました。`,
			`新規：${created}件、更新：${updated}件`
		].join('\n');
		return { success, message };
	}
};
