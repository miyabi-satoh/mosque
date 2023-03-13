import type { User } from '@prisma/client';

type PickupField =
	| 'id'
	| 'type'
	| 'username'
	| 'password'
	| 'displayName'
	| 'abbrev'
	| 'sei'
	| 'mei'
	| 'seiKana'
	| 'meiKana'
	| 'blocked';
export type UserUpdate = Partial<Pick<User, PickupField>>;

export const userType = {
	sysadmin: 1,
	admin: 2,
	user: 0
} as const;

export const userTypeString = (type: number) => {
	if (type == userType.sysadmin) {
		return `シスアド`;
	} else if (type == userType.admin) {
		return `管理者`;
	}
	return `一般`;
};

export const userPublicFields = {
	id: true,
	username: true,
	blocked: true,
	displayName: true,
	sei: true,
	mei: true,
	seiKana: true,
	meiKana: true,
	abbrev: true,
	type: true
} as const;
