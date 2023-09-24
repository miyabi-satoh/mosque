import { error } from '@sveltejs/kit';

import { hasAdminRole } from '$lib/utils';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	// ログインセッションを取得
	const session = await locals.auth.validate();
	// 認可
	if (!session || !hasAdminRole(session.user)) {
		throw error(404, 'Not found');
	}

	return {};
}) satisfies LayoutServerLoad;
