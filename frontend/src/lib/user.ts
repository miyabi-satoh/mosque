import type { User } from '@prisma/client';
import { writable } from 'svelte/store';
import type { Impartial } from './types';

export const userStore = writable<User | null>(null);

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
export type UserCreate = Impartial<Required<Omit<UserUpdate, 'id'>>>;
export type UserPostErrors = {
	[K in keyof UserCreate]?: string;
};

export const userType = {
	sysadmin: 1,
	admin: 2,
	user: 0
} as const;
