import type { UserRoleEnum } from '@prisma/client';

export const PROVIDERID_USERNAME = `username`;

const subRoute = (s: string | undefined) => (s !== undefined ? `/${s}` : '');
export const URLS = {
	LOGIN: '/login',
	LOGOUT: '/?/logout',
	PROFILE: (userId: string | undefined = undefined) => `/profile${subRoute(userId)}`,
	PASSWD: (userId: string | undefined = undefined) => `/passwd${subRoute(userId)}`,
	ADMIN: '/admin',
	ADMIN_ARCHIVE: (examType: string) => `/admin/${examType}`,
	ADMIN_ARCHIVES: (id: string | undefined = undefined) => `/admin/archives${subRoute(id)}`,
	ADMIN_ARCHIVE_ITEMS: (id: string | undefined = undefined) =>
		`/admin/archives${subRoute(id)}/items`,
	ADMIN_LINKS: (linkId: string | undefined = undefined) => `/admin/links${subRoute(linkId)}`,
	ADMIN_ACCOUNTS: '/admin/accounts',
	ADMIN_ACCOUNTS_BULK: '/admin/accounts/bulk',
	ADMIN_ACCOUNTS_CREATE: '/admin/accounts/create',
	ADMIN_ACCOUNTS_PRINT: '/admin/accounts/print',
	ARCHIVES: (id: string | undefined = undefined) => `/archives${subRoute(id)}`,
	BOARD: (channelId: string | undefined = undefined) => `/board${subRoute(channelId)}`,
	BOARD_CHANNEL: '/board/channel',
	API_CHANNEL: (channelId: string) => `/api/channel${subRoute(channelId)}`,
	API_ARCHIVE_ITEM: (itemId: string) => `/api/archive/item/${itemId}`,
	API_FETCH: (url: string) => `/api/fetch?url=${url}`,
	API_READDIR: `/api/readdir`
} as const;

export const userRoles = ['USER', 'STAFF', 'ADMIN', 'RETIRED'] as const satisfies Readonly<
	UserRoleEnum[]
>;

export const WS_EVENT_MESSAGEUPDATED = 'eventMessageUpdated';
