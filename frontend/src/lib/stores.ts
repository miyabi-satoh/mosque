import { writable } from 'svelte/store';
import type { IUserProfile } from '$models/interfaces';
import { removeLocalToken, saveLocalToken } from './utils';

export interface AppNotification {
	content: string;
	color?: string;
	showProgress?: boolean;
}

export interface MainState {
	token: string;
	isLoggedIn: boolean | null;
	logInError: boolean;
	userProfile: IUserProfile | null;
	dashboardMiniDrawer: boolean;
	dashboardShowDrawer: boolean;
	notifications: AppNotification[];
}

const defaultState: MainState = {
	isLoggedIn: null,
	token: '',
	logInError: false,
	userProfile: null,
	dashboardMiniDrawer: false,
	dashboardShowDrawer: true,
	notifications: []
};

function createMainState() {
	const { subscribe, update } = writable<MainState>(defaultState);

	const setToken = (token: string) => {
		if (token) {
			saveLocalToken(token);
		} else {
			removeLocalToken();
		}
		update((state) => {
			return { ...state, token };
		});
	};

	const setLoggedIn = (isLoggedIn: boolean) => {
		update((state) => {
			return { ...state, isLoggedIn };
		});
	};

	const setLogInError = (logInError: boolean) => {
		update((state) => {
			return { ...state, logInError };
		});
	};

	const setUserProfile = (userProfile: IUserProfile) => {
		update((state) => {
			return { ...state, userProfile };
		});
	};

	const addNotification = (payload: AppNotification) => {
		update((state) => {
			return { ...state, notifications: [...state.notifications, payload] };
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

export const mainState = createMainState();
