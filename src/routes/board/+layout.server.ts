import { redirect } from '@sveltejs/kit';

import { URLS } from '$lib/consts';
import { hasStaffRole } from '$lib/utils';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
	if (url.pathname !== URLS.BOARD_AUTH) {
		// ログインセッションを取得
		const session = await locals.auth.validate();
		// 認可
		if (!session || !hasStaffRole(session.user)) {
			throw redirect(302, URLS.BOARD_AUTH);
		}
	}

	return {};
}) satisfies LayoutServerLoad;
