import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { URL_ADMIN_USERS } from '$lib/constants';
import { exclude } from '$lib/utils';

export const load = (async ({ params, parent }) => {
	console.log(`/routes/(pages)/admin/users/[id=number]/delete/+page.server.ts`);

	const { breadcrumbParams } = await parent();
	const user = await prisma.user.findUnique({
		where: {
			id: Number(params.id)
		}
	});

	return {
		user: user ? exclude(user, ['password', 'token']) : null,
		pageMeta: {
			title: `ユーザー削除`
		},
		breadcrumbParams: [
			...breadcrumbParams,
			{
				name: `削除`
			}
		]
	};
}) satisfies PageServerLoad;

type ActionResult = {
	success?: boolean;
	message?: string;
};
export const actions: Actions = {
	default: async ({ params }): Promise<ActionResult> => {
		console.log(`POST /routes/(pages)/admin/users/[id=number]/delete/+page.server.ts`);
		const id = Number(params.id);
		const result = await prisma.user.delete({
			where: {
				id
			}
		});

		if (!result) {
			const message = `データベースの更新に失敗しました。`;
			// console.log(message);
			return { message };
		}

		throw redirect(303, URL_ADMIN_USERS);
	}
};
