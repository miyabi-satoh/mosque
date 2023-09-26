import { UserRole } from '@prisma/client';

import { URLS } from '$lib/consts';
import { createBuiltinUsers } from '$lib/server/lucia';
import { hasAdminRole } from '$lib/utils';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	// ビルトインユーザを作成
	await createBuiltinUsers();

	// ログインセッションを取得
	const session = await locals.auth.validate();
	const user = session?.user;

	// ユーザーメニュー
	const userMenus = [];
	if (user) {
		if (hasAdminRole(user)) {
			userMenus.push([URLS.ADMIN, `管理ページ`]);
		}
		userMenus.push([URLS.BOARD, `ボード`]);
		if (user.role !== UserRole.STAFF) {
			userMenus.push([URLS.PROFILE, `プロフィール`]);
		}
	}

	return {
		user,
		userMenus
	};
}) satisfies LayoutServerLoad;
