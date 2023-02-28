import { object, string, ValidationError } from 'yup';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ params, parent }) => {
	console.log(`frontend/src/routes/(pages)/admin/users/[id=number]/edit/+page.server.ts`);

	const { breadcrumbParams } = await parent();
	const user = await prisma.user.findUnique({
		where: {
			id: Number(params.id)
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

export const actions = {
	default: async ({ request }) => {
		const formData = Object.fromEntries(await request.formData());
		const userSchema = object({
			username: string().required(),
			displayName: string().required(),
			abbrev: string().required(),
			sei: string().required(),
			mei: string().required(),
			seiKana: string().required(),
			meiKana: string().required()
		});

		try {
			const validated = await userSchema.validate(formData, {
				abortEarly: false
			});
			return {
				success: true,
				formData
			};
		} catch (error) {
			if (error instanceof ValidationError) {
				const errors = error.inner.reduce((acc, err) => {
					return { ...acc, [err.path ?? 'error']: err.message };
				}, {});

				return {
					errors,
					formData
				};
			}
		}
	}
} satisfies Actions;
