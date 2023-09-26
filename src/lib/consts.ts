import type { LabelValueT } from './types';

export const URLS = {
	LOGIN: '/login',
	LOGOUT: '/?/logout',
	PROFILE: '/profile',
	SIGNUP: '/signup',
	ADMIN: '/admin',
	ADMIN_SITELINK: '/admin/sitelink',
	ADMIN_STAFF: '/admin/staff',
	ADMIN_USER: '/admin/user',
	BOARD: '/board',
	BOARD_AUTH: '/board/auth',
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
