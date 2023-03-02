import type { User } from '@prisma/client';
import { writable } from 'svelte/store';

export type { User };
export const userStore = writable<User | null>(null);

export const clearSecret = (user: User) => {
	if (user.password) {
		user.password = '';
	}
	if (user.token) {
		user.token = '';
	}
	return user;
};
