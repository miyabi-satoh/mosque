import type { User } from '@prisma/client';
import { writable } from 'svelte/store';
import { boolean, object, string } from 'yup';

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
export type UserCreate = NonNullable<Omit<UserUpdate, 'id'>>;

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
	seiKana: string().matches(/^[\p{scx=Katakana}]+$/u, 'カタカナで入力してください'),
	meiKana: string().matches(/^[\p{scx=Katakana}]+$/u, 'カタカナで入力してください'),
	blocked: boolean().default(false)
};

export const createUserSchema = object({
	username: userSchema.username.required(),
	password: userSchema.password.required('必須項目です'),
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
