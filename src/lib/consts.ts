import type { UserRoleEnum } from '@prisma/client';

export const PROVIDERID_USERNAME = `username`;

export const URLS = {
	LOGIN: '/login',
	LOGOUT: '/?/logout',
	PROFILE: '/profile',
	PASSWD: '/passwd',
	ADMIN: '/admin',
	ADMIN_LINKS: '/admin/links',
	ADMIN_ACCOUNTS: '/admin/accounts',
	ADMIN_ACCOUNTS_BULK: '/admin/accounts/bulk',
	ADMIN_ACCOUNTS_CREATE: '/admin/accounts/create',
	ADMIN_ACCOUNTS_PRINT: '/admin/accounts/print',
	BOARD: '/board',
	BOARD_CHANNEL: '/board/channel',
	API_DATA: '/api/data',
	API_FETCH: '/api/fetch?url='
} as const;

export const userRoles = ['USER', 'STAFF', 'ADMIN'] as const satisfies Readonly<UserRoleEnum[]>;
