import type { PageServerLoad } from './$types';

export const load = (async () => {
	console.log(`/routes/(pages)/admin/dbmainte/+page.server.ts`);

	return {};
}) satisfies PageServerLoad;
