import type { User } from '@prisma/client';
import { writable } from 'svelte/store';
import { boolean, number, string } from 'yup';
import type { Nullable } from './utils';

export type UserUpdate = Nullable<
	Pick<
		User,
		| 'id'
		| 'username'
		| 'password'
		| 'abbrev'
		| 'blocked'
		| 'displayName'
		| 'mei'
		| 'meiKana'
		| 'sei'
		| 'seiKana'
	>
>;

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

export const UserValidations = {
	id: () => {
		return number().min(1);
	},
	username: () => {
		return string()
			.min(4, '4文字以上で入力してください')
			.max(20, '20文字以下で入力してください')
			.matches(/^[0-9A-Za-z]+$/, '半角英数字のみ使用できます');
	},
	password: () => {
		return string()
			.min(4, '4文字以上で入力してください')
			.matches(/^[0-9A-Za-z]+$/, '半角英数字のみ使用できます');
	},
	displayName: () => {
		return string().max(5, '5文字以下で入力してください');
	},
	abbrev: () => {
		return string().max(5, '5文字以下で入力してください');
	},
	sei: () => {
		return string();
	},
	mei: () => {
		return string();
	},
	seiKana: () => {
		return string().matches(/^[\p{scx=Katakana}]+$/u, 'カタカナで入力してください');
	},
	meiKana: () => {
		return string().matches(/^[\p{scx=Katakana}]+$/u, 'カタカナで入力してください');
	},
	blocked: () => {
		return boolean();
	}
};
