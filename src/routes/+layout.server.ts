import { URLS } from '$lib/consts';
import { createBuiltinUsers } from '$lib/server/lucia';
import { hasAdminRole } from '$lib/utils';

import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	// create built-in users(admin, staff)
	await createBuiltinUsers();

	// get session
	const session = await locals.auth.validate();
	const user = session?.user;

	const userMenus = [];
	if (user) {
		// add user menu items if user is authenticated
		if (hasAdminRole(user)) {
			userMenus.push([URLS.ADMIN, `Dashboard`, 'mdi:view-dashboard']);
		}
		userMenus.push([URLS.PROFILE, `Edit Profile`, 'mdi:account-edit']);
		userMenus.push([URLS.PASSWD, `Change Password`, 'mdi:lock']);
	}

	return {
		user,
		userMenus
	};
}) satisfies LayoutServerLoad;
