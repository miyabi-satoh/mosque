import { ValidationError } from 'yup';
import type { Actions } from './$types';
import { fromRequest, fromValidationError } from '$lib/utils';
import { updateUser } from '$lib/server/user';
import type { UserPostErrors, UserUpdate } from '$lib/user';

type ActionResult = {
	success?: boolean;
	message?: string;
	formData: UserUpdate;
	errors?: UserPostErrors;
};

export const actions: Actions = {
	default: async ({ request, locals }): Promise<ActionResult> => {
		console.log(`POST frontend/src/routes/(pages)/me/+page.server.ts`);
		const formData: UserUpdate = await fromRequest(request);

		try {
			if (!locals.user) {
				throw new Error('権限がありません');
			}
			const _user = await updateUser(locals.user.id, formData);
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
