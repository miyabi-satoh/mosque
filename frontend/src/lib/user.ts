import type { User } from '@prisma/client';
import { writable } from 'svelte/store';
import type { UpdateSchema } from './utils';

export type UserUpdate = UpdateSchema<User>;

export const userStore = writable<User | null>(null);

export const clearSecret = (user: User) => {
	if (user.password) {
		user.password = null;
	}
	if (user.token) {
		user.token = null;
	}
	return user;
};
