import { object, string } from 'yup';
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

		return {
			success: true,
			formData
		};

		// バリデーション

		// const user = await prisma.user.update({
		// 	where: {
		// 		id: userData.id
		// 	},
		// 	data: {
		// 		...userData
		// 	}
		// });

		// let success = false;
		// if (user) {
		// 	success = true;
		// 	user.password = '';
		// 	return {
		// 		success,
		// 		user
		// 	};
		// }
		// return fail(400, {
		// 	success,
		// 	user
		// });
	}
} satisfies Actions;
