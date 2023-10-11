import { dev } from '$app/environment';

import { FEATURE_BOARD } from '$env/static/private';

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

	// enable Board or not
	const showBoard = ((): boolean => {
		if (dev) return true;
		if (FEATURE_BOARD === 'true') return !!user || isWindows(request.headers.get('User-Agent'));
		return false;
	})();

	// add user menu items if user is authenticated
	const userMenus = [];
	if (user) {
		if (hasAdminRole(user)) {
			userMenus.push([URLS.ADMIN, `Dashboard`, 'mdi:view-dashboard']);
			userMenus.push(['']);
		}
		if (showBoard) {
			userMenus.push([URLS.BOARD, `Board`, 'mdi:bulletin-board']);
			userMenus.push(['']);
		}
		userMenus.push([URLS.PROFILE, `Edit Profile`, 'mdi:account-edit']);
		userMenus.push([URLS.PASSWD, `Change Password`, 'mdi:lock']);
		userMenus.push(['']);
	} else {
		// create built-in user
		await createBuiltinUsers();
	}

	const breadcrumbs: BreadCrumbT[] = [{ label: 'Home', link: '/' }];

	return {
		user,
		userMenus,
		breadcrumbs,
		showBoard
	};
}) satisfies LayoutServerLoad;
