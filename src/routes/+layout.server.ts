import { URLS } from '$lib/consts';
import { createBuiltinUsers } from '$lib/server/lucia';
import { hasAdminRole, isWindows } from '$lib/utils';

import type { LayoutServerLoad } from './$types';

type BreadCrumbT = {
	label: string;
	link: string;
};
export const load = (async ({ locals, request, depends }) => {
	depends('auth:session');

	// get session
	const session = await locals.auth.validate();
	const user = session?.user;
	// console.log('user', user);

	const userMenus = [];
	if (user) {
		// add user menu items if user is authenticated
		if (hasAdminRole(user)) {
			userMenus.push([URLS.ADMIN, `Dashboard`, 'mdi:view-dashboard']);
		}
		userMenus.push([URLS.PROFILE, `Edit Profile`, 'mdi:account-edit']);
		userMenus.push([URLS.PASSWD, `Change Password`, 'mdi:lock']);
	} else {
		// create built-in user
		await createBuiltinUsers();
	}

	const breadcrumbs: BreadCrumbT[] = [{ label: 'Home', link: '/' }];

	return {
		user,
		userMenus,
		breadcrumbs,
		isWindows: isWindows(request.headers.get('user-agent'))
	};
}) satisfies LayoutServerLoad;
