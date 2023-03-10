import type { User } from '@prisma/client';
import { writable } from 'svelte/store';
import { boolean, object, string } from 'yup';
import type { Impartial } from './types';

export const userStore = writable<User | null>(null);

export const clearSecret = (user: User | null) => {
	if (user) {
		if (user.password) {
			user.password = null;
		}
		if (user.token) {
			user.token = null;
		}
	}
	return user;
};

type PickupField =
	| 'id'
	| 'username'
	| 'password'
	| 'blocked'
	| 'displayName'
	| 'sei'
	| 'mei'
	| 'seiKana'
	| 'meiKana'
	| 'abbrev';
export type UserUpdate = Partial<Pick<User, PickupField>>;
export type UserCreate = Impartial<Required<Omit<UserUpdate, 'id'>>>;
export type UserPostErrors = {
	[K in keyof UserCreate]?: string;
};

export const LABEL_USERNAME = 'ユーザー名';
export const LABEL_PASSWORD = 'パスワード';
export const LABEL_DISPLAYNAME = '表示名';
export const LABEL_ABBREV = '略称';
export const LABEL_SEI = '姓';
export const LABEL_MEI = '名';
export const LABEL_SEIKANA = '姓(ふりがな)';
export const LABEL_MEIKANA = '名(ふりがな)';
export const LABEL_BLOCKED = '使用不可';

const userSchema = {
	username: string()
		.min(4, '4文字以上で入力してください')
		.max(20, '20文字以下で入力してください')
		.matches(/^[0-9A-Za-z]+$/, '半角英数字のみ使用できます'),
	password: string()
		.min(4, '4文字以上で入力してください')
		.matches(/^[0-9A-Za-z]+$/, '半角英数字のみ使用できます'),
	displayName: string().max(5, '5文字以下で入力してください'),
	abbrev: string().max(5, '5文字以下で入力してください'),
	sei: string(),
	mei: string(),
	seiKana: string().matches(/^[\p{scx=Hiragana}\p{scx=Katakana}]+$/u, 'かなで入力してください'),
	meiKana: string().matches(/^[\p{scx=Hiragana}\p{scx=Katakana}]+$/u, 'かなで入力してください'),
	blocked: boolean().default(false)
};

export const createUserSchema = object({
	username: userSchema.username.required(),
	password: userSchema.password.required(),
	displayName: userSchema.displayName.required(),
	abbrev: userSchema.abbrev.required(),
	sei: userSchema.sei.required(),
	mei: userSchema.mei.required(),
	seiKana: userSchema.seiKana.required(),
	meiKana: userSchema.meiKana.required(),
	blocked: userSchema.blocked
});

export const updateUserSchema = object({
	username: userSchema.username,
	password: userSchema.password,
	displayName: userSchema.displayName,
	abbrev: userSchema.abbrev,
	sei: userSchema.sei,
	mei: userSchema.mei,
	seiKana: userSchema.seiKana,
	meiKana: userSchema.meiKana,
	blocked: userSchema.blocked
});
