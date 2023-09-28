import { URLS } from '$lib/consts';
import { createBuiltinUsers } from '$lib/server/lucia';
import { hasAdminRole } from '$lib/utils';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	// create built-in users(admin, staff)
	await createBuiltinUsers();

	// validate requests
	const session = await locals.auth.validate();
	const user = session?.user;

	const userMenus = [];
	if (user) {
		// add user menu items if user is authenticated
		if (hasAdminRole(user)) {
			userMenus.push([URLS.ADMIN, `Dashboard`]);
		}
		userMenus.push([URLS.BOARD, `Board`]);
		userMenus.push([URLS.PROFILE, `Edit Profile`]);
	}

	return {
		user,
		userMenus
	};
}) satisfies LayoutServerLoad;
