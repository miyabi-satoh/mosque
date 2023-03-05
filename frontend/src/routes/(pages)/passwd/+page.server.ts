import type { Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { getUser } from '$lib/server/session';
import { clearSecret } from '$lib/user';
import { comparePassword, encryptPassword } from '$lib/server/passwd';

// frontend/src/routes/(pages)/passwd/+page.server.ts
export const actions = {
	default: async ({ request, cookies }) => {
		let user = await getUser(cookies);
		if (user) {
			const data = await request.formData();
			const currrentPassword = data.get('currrent_password')?.toString();
			const newPassword = data.get('new_password')?.toString();
			const confirmPassword = data.get('confirm_password')?.toString();
			if (currrentPassword && newPassword && confirmPassword) {
				if (newPassword != confirmPassword) {
					return {
						message: `新しいパスワードと新しいパスワード(確認用)が一致していません`,
						user: null
					};
				}
				if (currrentPassword == newPassword) {
					return {
						message: `新しいパスワードが現在のパスワードと同一です`,
						user: null
					};
				}
				if (!comparePassword(currrentPassword, user.password ?? '')) {
					return {
						message: `パスワードが正しくありません`,
						user: null
					};
				}
				const encryptedPassword = encryptPassword(newPassword);
				user = await prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						password: encryptedPassword
					}
				});
				if (user) {
					return {
						message: `パスワードを更新しました`,
						user: clearSecret(user)
					};
				}
			}
		}
		return {
			message: `パスワードの更新に失敗しました`,
			user: null
		};
	}
} satisfies Actions;
