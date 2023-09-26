import { error, fail } from '@sveltejs/kit';

import { ExamType, ResourceState, type Resource } from '@prisma/client';
import path from 'node:path';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { ResourceSchema } from '$lib/schemas/zod';
import { db } from '$lib/server/db';
import { getExamConfig, searchFiles } from '$lib/server/utils';
import type { LabelValueT } from '$lib/types';
import { convertFullWidthNumbersToHalf, exclude } from '$lib/utils';

import type { Actions, PageServerLoad } from './$types';

type EntryT = {
	id: string;
	state: ResourceState;
	year: LabelValueT;
	grade: LabelValueT;
	numOf: LabelValueT;
	category: LabelValueT;
	path: string;
};
const schema = z.object({
	checked: z.string().array()
});
const parseSchema = ResourceSchema.pick({
	year: true,
	grade: true,
	numOf: true,
	category: true,
	title: true,
	shortTitle: true,
	path: true
});

export const load = (async ({ locals, params }) => {
	const session = await locals.auth.validate();
	if (!session) {
		console.error('Cannot read session');
		throw error(500, 'Internal Server Error');
	}

	const examType = params.type.toLowerCase() as ExamType;
	const exam = await db.exam.findUnique({ where: { examType: examType } });
	if (!exam) {
		console.error(`Cannot read exam(examType = '${examType}')`);
		throw error(500, 'Internal Server Error');
	}

	await db.resourceTemp.deleteMany({
		where: {
			sessionId: session.sessionId,
			examType: examType
		}
	});

	const dataInDB = await db.resource.findMany({ where: { examType: examType } });
	const count = {
		ok: 0,
		new: 0,
		missing: 0
	};

	const config = getExamConfig(exam);

	const dataOnDisk: Resource[] = [];
	const files = searchFiles(config.baseDir, /\.(mp3|pdf)$/).sort();
	const re = new RegExp(`^${config.baseDir}${path.sep}?`, 'i');

	for (const file of files) {
		let res = {} as Resource;
		const convertedPath = convertFullWidthNumbersToHalf(file).toLowerCase();
		const filename = path.basename(convertedPath);

		// ディレクトリ名から類推
		const paths = convertedPath.split(path.sep);
		paths.forEach((pathItem) => {
			const m = pathItem.match(/^(?<year>20\d\d)(年度?)?$/);
			if (m && m.groups) {
				res.year = Number(m.groups.year);
			} else {
				const m = pathItem.match(/^第(?<numOf>\d)回$/);
				if (m && m.groups) {
					res.numOf = Number(m.groups.numOf);
				} else {
					const m = pathItem.match(/^(?<numOf>\d{1,2})月号?$/);
					if (m && m.groups) {
						res.numOf = Number(m.groups.numOf);
					}
				}
			}
		});

		res = {
			...res,
			...config.parse(filename, config.valueGrade),
			path: file
		};
		const result = parseSchema.safeParse(res);
		if (!result.success) {
			console.log('invalid data', res);
		} else {
			const found = dataInDB.find((data) => {
				return (
					data.year === res.year &&
					data.grade === res.grade &&
					data.numOf === res.numOf &&
					data.category === res.category &&
					data.title === res.title &&
					data.shortTitle === res.shortTitle &&
					data.path === res.path
				);
			});
			if (found) {
				res.id = found.id;
				count.ok++;
			} else {
				count.new++;
			}
			dataOnDisk.push({
				...res
			});
		}
	}

	for (const data of dataOnDisk) {
		await db.resourceTemp.create({
			data: {
				...data,
				id: data.id ?? undefined,
				sessionId: session.sessionId,
				state: data.id ? ResourceState.ok : ResourceState.new,
				examType: examType
			}
		});
	}
	for (const data of dataInDB) {
		if (!dataOnDisk.some((dod) => dod.id === data.id)) {
			await db.resourceTemp.create({
				data: {
					...data,
					sessionId: session.sessionId,
					state: ResourceState.missing
				}
			});
			count.missing++;
		}
	}

	const tempData = await db.resourceTemp.findMany({
		where: {
			sessionId: session.sessionId,
			examType
		},
		orderBy: [
			{ state: 'asc' },
			{ year: 'desc' },
			{ numOf: 'desc' },
			{ grade: 'asc' },
			{ category: 'asc' }
		]
	});

	const initialData = {
		checked: [] as string[]
	};
	const entries = tempData.map((data) => {
		if (re.test(data.path)) {
			data.path = data.path.replace(re, '');
		} else {
			data.path = '...' + path.sep + path.basename(data.path);
		}
		if (data.state === ResourceState.ok) {
			initialData.checked.push(data.id);
		}
		return {
			id: data.id,
			state: data.state,
			year: { label: config.labelYear(data.year), value: data.year },
			numOf: { label: config.labelNumOf(data.numOf), value: data.numOf },
			grade: { label: config.labelGrade(data.grade), value: data.grade },
			category: { label: data.shortTitle, value: data.category },
			path: data.path
		} satisfies EntryT;
	});

	const form = await superValidate(initialData, schema);

	return {
		form,
		entries,
		headers: config.headers,
		exam,
		count,
		ResourceState
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		// フォームデータのバリデーション
		const form = await superValidate(request, schema);
		if (!form.valid) {
			return fail(400, { form });
		}

		const session = await locals.auth.validate();
		if (!session) {
			console.error('Cannot read session');
			return fail(500, { form, message: 'Internal Server Error' });
		}

		const examType = params.type.toLowerCase() as ExamType;

		// 更新処理
		try {
			// 一時テーブルの該当レコードを取得
			const res = await db.resourceTemp.findMany({
				where: {
					id: {
						in: form.data.checked
					}
				}
			});

			// 本テーブルのレコードを削除
			await db.resource.deleteMany({
				where: {
					examType: examType
				}
			});

			// 本テーブルを更新
			await db.resource.createMany({
				data: res.map((r) => exclude(r, ['sessionId', 'state']))
			});

			// 一時テーブルを削除 -> load()で
		} catch (e) {
			console.log(e);
			return fail(400, { form: { ...form, message: 'DB更新エラー' } });
		}
		return { form };
	}
};
