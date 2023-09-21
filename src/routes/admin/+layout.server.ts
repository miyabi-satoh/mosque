import { error } from '@sveltejs/kit';

import { UserRole } from '@prisma/client';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session || session.user.role !== UserRole.ADMIN) {
		throw error(404, 'Not found');
	}

	return {};
}) satisfies LayoutServerLoad;
