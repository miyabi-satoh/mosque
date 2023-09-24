import { URLS } from '$lib/consts';
import { hasStaffRole } from '$lib/utils';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	// ログインセッションを取得
	const session = await locals.auth.validate();
	// 認可
	if (!session || !hasStaffRole(session.user)) {
		return Response.redirect(URLS.BOARD_AUTH, 302);
	}

	return {};
}) satisfies LayoutServerLoad;
