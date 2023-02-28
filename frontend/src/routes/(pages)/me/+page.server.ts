import type { Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { getUser } from '$lib/server/session';
import { clearSecret } from '$lib/user';

// frontend/src/routes/(pages)/me/+page.server.ts
export const actions = {
	default: async ({ request, cookies }) => {
		let user = await getUser(cookies);
		if (user) {
			const data = await request.formData();
			const displayName = data.get('displayName');
			if (displayName) {
				user = await prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						displayName: String(displayName)
					}
				});
				if (user) {
					return {
						message: `更新しました`,
						user: clearSecret(user)
					};
				}
			}
		}

		return {
			message: '更新に失敗しました',
			user: null
		};
	}
} satisfies Actions;
