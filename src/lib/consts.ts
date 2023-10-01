import type { LabelValueT } from './types';

export const PROVIDERID_USERNAME = `username`;

export const URLS = {
	LOGIN: '/login',
	LOGOUT: '/?/logout',
	PROFILE: '/profile',
	PASSWD: '/passwd',
	ADMIN: '/admin',
	ADMIN_LINKS: '/admin/links',
	ADMIN_ACCOUNTS: '/admin/accounts',
	ADMIN_ACCOUNTS_CREATE: '/admin/accounts/create',
	BOARD: '/board',
	API_DATA: '/api/data',
	API_FETCH: '/api/fetch?url='
} as const;

export const categories = {
	undefined: {
		label: 'undefined',
		value: undefined
	} satisfies LabelValueT<undefined>,
	ongen: {
		label: 'リスニング音源',
		shortLabel: '音源',
		value: 0
	} satisfies LabelValueT,
	jaOngen: {
		label: '国語 聞き取り問題',
		shortLabel: '国語音源',
		value: 1
	} satisfies LabelValueT,
	enOngen: {
		label: '英語 リスニング問題',
		shortLabel: '英語音源',
		value: 2
	} satisfies LabelValueT,
	mondai: {
		label: '問題冊子',
		value: 100
	} satisfies LabelValueT,
	kaitou: {
		label: '解答',
		value: 200
	} satisfies LabelValueT
} as const;
