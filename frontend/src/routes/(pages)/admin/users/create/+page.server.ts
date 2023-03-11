import { ValidationError } from 'yup';
import type { Actions, PageServerLoad } from './$types';
import { requestToObject, validationErrorToAssoc } from '$lib/utils';
import { createUser } from '$lib/server/user';
import type { UserCreate, UserPostErrors } from '$lib/user';

export const load = (async ({ parent }) => {
	console.log(`/routes/(pages)/admin/users/create/+page.server.ts`);
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
	formData: UserCreate;
	errors?: UserPostErrors;
};
export const actions: Actions = {
	default: async ({ request }): Promise<ActionResult> => {
		console.log(`POST /routes/(pages)/admin/users/create/+page.server.ts`);
		const formData: UserCreate = await requestToObject(request);
		// console.log(formData);

		try {
			const _user = await createUser(formData);
		} catch (err) {
			if (err instanceof ValidationError) {
				const message = `入力データに不備があります。`;
				const errors = validationErrorToAssoc(err);
				return { message, formData, errors };
			} else if (err instanceof Error) {
				const message = err.message;
				return { message, formData };
			}
		}

		return {
			success: true,
			formData
		};
	}
};
