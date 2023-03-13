import type { Actions, PageServerLoad } from './$types';
import { errorToResult, requestToObject } from '$lib/utils';
import { updateUser } from '$lib/server/user';
import { userPublicFields, type UserUpdate } from '$lib/user';
import { prisma } from '$lib/server/prisma';
import type { ActionResult } from '$lib/types';
import { MSG } from '$lib/constants';

export const load = (async ({ locals }) => {
	console.log(`/routes/(pages)/(auth)/me/+page.server.ts`);
	const user = await prisma.user.findUnique({
		where: {
			id: locals.user.id
		},
		select: userPublicFields
	});
	return {
		me: user
	};
}) satisfies PageServerLoad;

type Result = ActionResult<UserUpdate>;

export const actions: Actions = {
	default: async ({ request, locals }): Promise<Result> => {
		console.log(`POST /routes/(pages)/me/+page.server.ts`);
		const formData: Result['formData'] = await requestToObject(request);

		try {
			if (!locals.user) {
				throw new Error('権限がありません');
			}
			const result = await updateUser(locals.user.id, formData);
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
