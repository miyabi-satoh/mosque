import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ url, parent }) => {
	const parentData = await parent();
	return {
		breadcrumbParams: [
			...parentData.breadcrumbParams,
			{
				href: url.pathname,
				name: 'プロフィール編集'
			}
		],
		pageMeta: {
			title: 'プロフィール編集',
			description: ''
		}
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const displayName = data.get('displayName');
		if (id && displayName) {
			const user = await prisma.user.update({
				where: {
					id: Number(id)
				},
				data: {
					displayName: String(displayName)
				}
			});
			return { user };
		}
		throw error(400, 'Bad request');
	}
} satisfies Actions;
