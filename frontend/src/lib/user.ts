import type { User } from '@prisma/client';
import { writable } from 'svelte/store';

export type { User };
export const userStore = writable<User | null>(null);

export const clearSecret = (user: User) => {
	user.password = '';
	user.token = '';
	return user;
};
