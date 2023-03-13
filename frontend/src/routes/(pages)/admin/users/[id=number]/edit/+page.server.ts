import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { errorToResult, requestToObject } from '$lib/utils';
import { updateUser } from '$lib/server/user';
import { userPublicFields, type UserUpdate } from '$lib/user';
import type { ActionResult } from '$lib/types';
import { MSG } from '$lib/constants';

export const load = (async ({ params, parent }) => {
	console.log(`/routes/(pages)/admin/users/[id=number]/edit/+page.server.ts`);

	const { breadcrumbParams } = await parent();
	const user = await prisma.user.findUnique({
		where: {
			id: Number(params.id)
		},
		select: userPublicFields
	});

	return {
		user,
		pageMeta: {
			title: `ユーザー編集`
		},
		breadcrumbParams: [
			...breadcrumbParams,
			{
				name: `ユーザー編集`
			}
		]
	};
}) satisfies PageServerLoad;

type Result = ActionResult<UserUpdate>;

export const actions: Actions = {
	default: async ({ params, request }): Promise<Result> => {
		console.log(`POST /routes/(pages)/admin/users/[id=number]/edit/+page.server.ts`);
		const id = Number(params.id);
		const formData: Result['formData'] = await requestToObject(request);

		try {
			const result = await updateUser(id, formData);
			return {
				success: true,
				formData,
				id: result.id
			};
		} catch (err) {
			const result = errorToResult(err, formData);
			if (result !== undefined) {
				return result;
			}
		}

		return { message: MSG.UKNOWN_ERROR, formData };
	}
};
