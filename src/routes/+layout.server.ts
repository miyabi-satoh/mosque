import { createBuiltinUsers } from '$lib/server/lucia';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	// ビルトインユーザーを作成
	await createBuiltinUsers();

	// ログインセッションを取得
	const session = await locals.auth.validate();
	return {
		user: session ? session.user : undefined
	};
}) satisfies LayoutServerLoad;
