import { ValidationError } from 'yup';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { fromRequest, fromValidationError } from '$lib/utils';
import { updateUser } from '$lib/server/user';
import type { UserCreate, UserPostErrors } from '$lib/user';

export const load = (async ({ params, parent }) => {
	console.log(`frontend/src/routes/(pages)/admin/users/[id=number]/edit/+page.server.ts`);

	const { breadcrumbParams } = await parent();
	const user = await prisma.user.findUnique({
		where: {
			id: Number(params.id)
		},
		select: {
			username: true,
			displayName: true,
			abbrev: true,
			sei: true,
			mei: true,
			seiKana: true,
			meiKana: true
		}
	});

	return {
		user,
		pageMeta: {
			title: `ユーザー編集`
		},
		breadcrumbParams: [
			...breadcrumbParams,
			{
				name: `編集`
			}
		]
	};
}) satisfies PageServerLoad;

type ActionResult = {
	success?: boolean;
	message?: string;
	formData: UserCreate;
	errors?: UserPostErrors;
};
export const actions: Actions = {
	default: async ({ params, request }): Promise<ActionResult> => {
		console.log(`POST frontend/src/routes/(pages)/admin/users/[id=number]/edit/+page.server.ts`);
		const id = Number(params.id);
		const formData: UserCreate = await fromRequest(request);

		try {
			const _user = await updateUser(id, formData);
		} catch (err) {
			if (err instanceof ValidationError) {
				const message = `入力データに不備があります。`;
				const errors = fromValidationError(err);
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
