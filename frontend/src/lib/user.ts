import type { User } from '@prisma/client';
import { writable } from 'svelte/store';

export type { User };
export const userStore = writable<User | null>(null);

const AUTH_TOKEN = 'token';

export const getToken = () => {
	return localStorage.getItem(AUTH_TOKEN);
};

export const setToken = (token: string) => {
	if (token) {
		localStorage.setItem(AUTH_TOKEN, token);
	}
};

export const removeToken = () => {
	localStorage.removeItem(AUTH_TOKEN);
};
