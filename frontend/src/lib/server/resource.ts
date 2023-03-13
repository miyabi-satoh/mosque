import { object, string } from 'yup';
import type { Resource } from '@prisma/client';
import { prisma } from './prisma';
import { normalizeSearch } from '$lib/utils';
import { resourcePublicFields, type ResourceUpdate } from '$lib/resource';
import type { fields } from '$lib/fields';
import { MSG } from '$lib/constants';

type Field = typeof fields.resource;
type Schema = Resource;
type UpdateSchema = ResourceUpdate;
const publicFields = resourcePublicFields;

// リソースのバリデーションスキーマ
const resourceSchema = object({
	title: string(),
	description: string()
} satisfies { [K in keyof Field]: object });

// リソースの追加、更新
const upsertResource = async (data: UpdateSchema, id: number | undefined = undefined) => {
	const validated = await resourceSchema.validate(data, { abortEarly: false });

	const keyword = [validated.title, validated.description].reduce((prev: string, cur) => {
		if (typeof cur === 'string' && !prev.includes(cur)) {
			return prev + ' ' + cur;
		}
		return prev;
	}, '');

	const dtNow = new Date();
	const baseData = {
		...(validated as Schema),
		keyword: normalizeSearch(keyword),
		updatedAt: new Date(),
		updated_by_id: 1
	};

	let result;
	if (id) {
		result = await prisma.resource.update({
			where: {
				id
			},
			data: {
				...baseData
			}
		});
	} else {
		result = await prisma.resource.create({
			data: {
				...baseData,
				createdAt: dtNow,
				created_by_id: 1,
				count: 0
			}
		});
	}

	if (!result) {
		throw new Error(`データベースの更新に失敗しました。`);
	}

	return result;
};

// リソースの更新
export const updateResource = async (id: number, data: UpdateSchema) => {
	// 対象のデータを取得する
	const dataInDB = await prisma.resource.findUnique({
		where: {
			id
		},
		select: publicFields
	});
	if (!dataInDB) {
		throw new Error(MSG.TARGET_NOT_FOUND);
	}

	// マージ
	const merged = {
		...dataInDB,
		...data
	} as UpdateSchema;

	return await upsertResource(merged, id);
};

// リソースの作成
export const createResource = async (data: UpdateSchema) => {
	return await upsertResource(data);
};
