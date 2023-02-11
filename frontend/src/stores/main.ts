import { writable } from 'svelte/store';
import { removeLocalToken, saveLocalToken } from '$lib/utils';
import type { IUserProfile } from '$schemas';

export interface AppNotification {
	content: string;
	color?: string;
	showProgress?: boolean;
}

export interface MainStore {
	token: string;
	isLoggedIn: boolean | null;
	logInError: boolean;
	userProfile: IUserProfile | null;
	dashboardMiniDrawer: boolean;
	dashboardShowDrawer: boolean;
	notifications: AppNotification[];
}

const defaultStore: MainStore = {
	isLoggedIn: null,
	token: '',
	logInError: false,
	userProfile: null,
	dashboardMiniDrawer: false,
	dashboardShowDrawer: true,
	notifications: []
};

function createMainStore() {
	const { subscribe, update } = writable<MainStore>(defaultStore);

	const setToken = (token: string) => {
		if (token) {
			saveLocalToken(token);
		} else {
			removeLocalToken();
		}
		update((store) => {
			return { ...store, token };
		});
	};

	const setLoggedIn = (isLoggedIn: boolean) => {
		update((store) => {
			return { ...store, isLoggedIn };
		});
	};

	const setLogInError = (logInError: boolean) => {
		update((store) => {
			return { ...store, logInError };
		});
	};

	const setUserProfile = (userProfile: IUserProfile) => {
		update((store) => {
			return { ...store, userProfile };
		});
	};

	const addNotification = (payload: AppNotification) => {
		update((store) => {
			return { ...store, notifications: [...store.notifications, payload] };
		});
	};

	return {
		subscribe,
		setToken,
		setLoggedIn,
		setLogInError,
		setUserProfile,
		addNotification
	};
}

export const mainStore = createMainStore();
