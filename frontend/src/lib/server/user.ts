import { boolean, number, object, string } from 'yup';
import type { User } from '@prisma/client';
import { encryptPassword } from './passwd';
import { prisma } from './prisma';
import { convertToKatakana, exclude, normalizeSearch } from '$lib/utils';
import type { UserCreate, UserUpdate } from '$lib/user';
import { fields } from '$lib/fields';

export const passwordSchema = string()
	.nullable()
	.transform((o, c) => (o === '' ? null : c))
	.min(fields.user.password.minlength, '${min}文字以上で入力してください')
	.matches(/^[0-9A-Za-z]+$/, '半角英数字のみ使用できます');

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
	const type = number().default(0);

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

const upsertUser = async (data: UserUpdate, id: number | undefined = undefined) => {
	const keywords = [
		data.username,
		data.displayName,
		data.abbrev,
		data.sei,
		data.mei,
		data.seiKana,
		data.meiKana
	];

	const dtNow = new Date();
	const baseData = {
		...(data as User),
		keyword: normalizeSearch(
			keywords.reduce((prev: string, cur) => {
				if (typeof cur === 'string' && !prev.includes(cur)) {
					return prev + ' ' + cur;
				}
				return prev;
			}, '')
		),
		password: data.password ? encryptPassword(data.password) : undefined,
		email: `${data.username}@mosque.local`,
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

export const updateUser = async (id: number, data: UserUpdate) => {
	// 対象のデータを取得する
	const userInDB = await prisma.user.findUnique({
		where: {
			id
		}
	});
	if (!userInDB) {
		throw new Error(`対象のデータが見つかりませんでした。`);
	}

	// マージ
	const merged = {
		...exclude(userInDB, ['password']),
		...data
	} as UserUpdate;

	const updateUserSchema = getUserSchema(id);
	const validated = await updateUserSchema.validate(merged, { abortEarly: false });
	return await upsertUser(validated, id);
};

export const createUser = async (data: UserCreate) => {
	const createUserSchema = getUserSchema();
	const validated = await createUserSchema.validate(data, { abortEarly: false });

	return await upsertUser(validated);
};

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
