import type { RequestHandler } from './$types';

// frontend/src/routes/api/user/export/+server.ts
export const GET = (async () => {
	const body = `ユーザー名, 姓, 名, 姓カナ, 名カナ, 略称, 表示名`;

	// TODO:

	return new Response(body, {
		status: 200,
		headers: {
			'Content-Type': 'text/csv',
			'Content-Disposition': 'attachment; filename=users.csv'
		}
	});
}) satisfies RequestHandler;
