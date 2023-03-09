import type { Actions, PageServerLoad } from './$types';
import { createUserSchema, type UserCreate } from '$lib/user';
import { fromRequest, fromValidationError } from '$lib/utils';

export const load = (async ({ parent }) => {
	console.log(`frontend/src/routes/(pages)/admin/users/create/+page.server.ts`);
	const { breadcrumbParams } = await parent();
	return {
		breadcrumbParams: [
			...breadcrumbParams,
			{
				href: '',
				name: 'ユーザー追加'
			}
		],
		pageMeta: {
			title: 'ユーザー追加'
		}
	};
}) satisfies PageServerLoad;

type ActionResult = {
	success?: boolean;
	message?: string;
	user?: UserCreate;
	errors?: {
		[key in keyof UserCreate]?: string;
	};
};
export const actions: Actions = {
	default: async ({ request }): Promise<ActionResult> => {
		console.log(`POST frontend/src/routes/(pages)/admin/users/create/+page.server.ts`);
		const data: UserCreate = await fromRequest(request);
		// console.log(data);

		try {
			const validated = await createUserSchema.validate(data, { abortEarly: false });
		} catch (err) {
			console.log(err);
			const message = `入力データに不備があります。`;
			const errors = fromValidationError(err);
			console.log(errors);
			return { message, errors };
		}

		return {
			success: true,
			user: data
		};
	}
};
