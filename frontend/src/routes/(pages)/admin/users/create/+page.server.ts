import type { Actions } from './$types';
import { errorToResult, requestToObject } from '$lib/utils';
import { createUser } from '$lib/server/user';
import type { UserUpdate } from '$lib/user';
import type { ActionResult } from '$lib/types';
import { MSG } from '$lib/constants';

type Result = ActionResult<UserUpdate>;

export const actions: Actions = {
	default: async ({ request }): Promise<Result> => {
		console.log(`POST /routes/(pages)/admin/users/create/+page.server.ts`);
		const formData: Result['formData'] = await requestToObject(request);

		try {
			const result = await createUser(formData);
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
