import { boolean, number, object, string } from 'yup';
import type { User } from '@prisma/client';
import { encryptPassword } from './passwd';
import { prisma } from './prisma';
import { convertToKatakana, normalizeSearch } from '$lib/utils';
import { userPublicFields, userType, type UserUpdate } from '$lib/user';
import { fields } from '$lib/fields';
import { MSG } from '$lib/constants';

// パスワードのバリデーションスキーマ
// パスワードのみを更新することがあるので独立させている
export const passwordSchema = string()
	.nullable()
	.transform((o, c) => (o === '' ? null : c))
	.min(fields.user.password.minlength, '${min}文字以上で入力してください')
	.matches(/^[0-9A-Za-z]+$/, '半角英数字のみ使用できます');

// ユーザーのバリデーションスキーマ
// idの有無(Create/Update)で挙動を変えるため関数化している
const getUserSchema = (id: number | undefined = undefined) => {
	const username = string()
		.min(fields.user.username.minlength, '${min}文字以上で入力してください')
		.max(fields.user.username.maxlength, '${max}文字以下で入力してください')
		.matches(/^[0-9A-Za-z]+$/, '半角英数字のみ使用できます')
		.test(
			'username-is-unique',
			'すでに使用されています。',
			async (value) => (await isUsernameUnique(value, id)) == true
		);
	const password = passwordSchema;
	const displayName = string().max(
		fields.user.displayName.maxlength,
		'${max}文字以下で入力してください'
	);
	const abbrev = string()
		.max(fields.user.abbrev.maxlength, '${max}文字以下で入力してください')
		.test(
			'abbrev-is-unique',
			'すでに使用されています。',
			async (value) => (await isAbbrevUnique(value, id)) == true
		);
	const sei = string();
	const mei = string();
	const seiKana = string()
		.matches(/^[\p{scx=Hiragana}\p{scx=Katakana}]+$/u, 'かなで入力してください')
		.transform((c) => convertToKatakana(c));
	const meiKana = string()
		.matches(/^[\p{scx=Hiragana}\p{scx=Katakana}]+$/u, 'かなで入力してください')
		.transform((c) => convertToKatakana(c));
	const blocked = boolean().default(false);
	const type = number().default(userType.user);

	if (id) {
		return object({
			username,
			password,
			displayName,
			abbrev,
			sei,
			mei,
			seiKana,
			meiKana,
			blocked,
			type
		} satisfies { [K in keyof typeof fields.user]: object });
	} else {
		return object({
			username: username.required(),
			password: password.required(),
			displayName: displayName.required(),
			abbrev: abbrev.required(),
			sei: sei.required(),
			mei: mei.required(),
			seiKana: seiKana.required(),
			meiKana: meiKana.required(),
			blocked,
			type
		} satisfies { [K in keyof typeof fields.user]: object });
	}
};

// ユーザーの追加、更新
const upsertUser = async (data: UserUpdate, id: number | undefined = undefined) => {
	const updateUserSchema = getUserSchema(id);
	const validated = await updateUserSchema.validate(data, { abortEarly: false });

	const keyword = [
		validated.username,
		validated.displayName,
		validated.abbrev,
		validated.sei,
		validated.mei,
		validated.seiKana,
		validated.meiKana
	].reduce((prev: string, cur) => {
		if (typeof cur === 'string' && !prev.includes(cur)) {
			return prev + ' ' + cur;
		}
		return prev;
	}, '');

	const dtNow = new Date();
	const baseData = {
		...(validated as User),
		keyword: normalizeSearch(keyword),
		password: validated.password ? encryptPassword(validated.password) : undefined,
		email: `${validated.username}@mosque.local`,
		updatedAt: new Date(),
		updated_by_id: 1
	};

	let result;
	if (id) {
		result = await prisma.user.update({
			where: {
				id
			},
			data: {
				...baseData
			}
		});
	} else {
		result = await prisma.user.create({
			data: {
				...baseData,
				provider: 'local',
				confirmed: true,
				createdAt: dtNow,
				created_by_id: 1
			}
		});
	}

	if (!result) {
		throw new Error(`データベースの更新に失敗しました。`);
	}

	return result;
};

// ユーザーの更新
export const updateUser = async (id: number, data: UserUpdate) => {
	// 対象のデータを取得する
	const userInDB = await prisma.user.findUnique({
		where: {
			id
		},
		select: userPublicFields
	});
	if (!userInDB) {
		throw new Error(MSG.TARGET_NOT_FOUND);
	}

	// マージ
	const merged = {
		...userInDB,
		...data
	} as UserUpdate;

	return await upsertUser(merged, id);
};

// ユーザーの作成
export const createUser = async (data: UserUpdate) => {
	return await upsertUser(data);
};

// usernameがユニークか判定する
const isUsernameUnique = async (username: string | undefined, id?: number) => {
	if (!username) {
		return true;
	}

	const whereId = id ? { id: { not: id } } : {};
	const ret = await prisma.user.findFirst({
		where: {
			...whereId,
			username
		}
	});
	return !ret;
};

// abbrevがユニークか判定する
const isAbbrevUnique = async (abbrev: string | undefined, id?: number) => {
	if (!abbrev) {
		return true;
	}

	const whereId = id ? { id: { not: id } } : {};
	const ret = await prisma.user.findFirst({
		where: {
			...whereId,
			abbrev
		}
	});
	return !ret;
};
