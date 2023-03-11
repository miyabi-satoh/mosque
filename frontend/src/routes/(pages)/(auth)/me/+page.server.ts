import { ValidationError } from 'yup';
import type { Actions, PageServerLoad } from './$types';
import { exclude, requestToObject, validationErrorToAssoc } from '$lib/utils';
import { updateUser } from '$lib/server/user';
import type { UserPostErrors, UserUpdate } from '$lib/user';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ locals }) => {
	console.log(`/routes/(pages)/(auth)/me/+page.server.ts`);
	const user = await prisma.user.findUnique({
		where: {
			id: locals.user.id
		}
	});
	return {
		me: user ? exclude(user, ['password', 'token']) : null
	};
}) satisfies PageServerLoad;

type ActionResult = {
	success?: boolean;
	message?: string;
	formData: UserUpdate;
	errors?: UserPostErrors;
};

export const actions: Actions = {
	default: async ({ request, locals }): Promise<ActionResult> => {
		console.log(`POST /routes/(pages)/me/+page.server.ts`);
		const formData: UserUpdate = await requestToObject(request);

		try {
			if (!locals.user) {
				throw new Error('権限がありません');
			}
			const _user = await updateUser(locals.user.id, formData);
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
