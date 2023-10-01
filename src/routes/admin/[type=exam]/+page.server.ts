import { error, fail } from '@sveltejs/kit';

import type { Exam, ExamTypeEnum, TempResource } from '@prisma/client';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { ResourceSchema } from '$lib/schemas/zod';
import { db } from '$lib/server/db';
import { getExamConfig } from '$lib/server/exam';
import { searchFiles } from '$lib/server/utils';
// import type { LabelValueT } from '$lib/types';
import { convertFullWidthNumbersToHalf, exclude } from '$lib/utils';

import type { Actions, PageServerLoad } from './$types';

// type EntryT = {
// 	id: string;
// 	state: ResourceState;
// 	year: LabelValueT;
// 	grade: LabelValueT;
// 	numOf: LabelValueT;
// 	category: LabelValueT;
// 	path: string;
// };
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

async function refreshTempResources(sessionId: string, exam: Exam) {
	// clear resouce-temp
	await db.tempResource.deleteMany({
		where: {
			sessionId,
			examType: exam.examType
		}
	});

	const config = getExamConfig(exam);
	const files = searchFiles(config.baseDir, /\.(mp3|pdf)$/).sort();
	for (const file of files) {
		let res = {} as TempResource;
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
			path: file,
			id: createHash('sha256').update(convertedPath).digest('hex')
		};
		const result = parseSchema.safeParse(res);
		if (!result.success) {
			console.log('invalid data', res);
		} else {
			const found = await db.resource.findUnique({
				where: {
					id_examType: { id: res.id, examType: exam.examType }
				}
			});
			await db.tempResource.create({
				data: {
					...res,
					sessionId: sessionId,
					state: found ? 'ok' : 'new',
					examType: exam.examType
				}
			});
		}
	}
}

export const load = (async ({ locals, params }) => {
	const session = await locals.auth.validate();
	if (!session) {
		console.error('Cannot read session');
		throw error(500, 'Internal Server Error');
	}

	const examType = params.type.toLowerCase() as ExamTypeEnum;
	const exam = await db.exam.findUnique({ where: { examType: examType } });
	if (!exam) {
		console.error(`Cannot read exam(examType = '${examType}')`);
		throw error(500, 'Internal Server Error');
	}

	// refresh resouce-temp
	await refreshTempResources(session.sessionId, exam);

	const tempData = await db.tempResource.findMany({
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
	await db.tempResource.deleteMany({
		where: {
			sessionId: session.sessionId,
			examType
		}
	});

	const config = getExamConfig(exam);
	const initialData = {
		checked: [] as string[]
	};
	const re = new RegExp(`^${config.baseDir}${path.sep}?`, 'i');
	const entries = tempData.map((data) => {
		if (re.test(data.path)) {
			data.path = data.path.replace(re, '');
		} else {
			data.path = '...' + path.sep + path.basename(data.path);
		}
		if (data.state === 'ok') {
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
		};
	});

	const form = await superValidate(initialData, schema);

	return {
		form,
		entries,
		headers: config.headers,
		exam
		// count,
		// ResourceState
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

		const examType = params.type.toLowerCase() as ExamTypeEnum;
		const exam = await db.exam.findUnique({ where: { examType: examType } });
		if (!exam) {
			console.error(`Cannot read exam(examType = '${examType}')`);
			throw error(500, 'Internal Server Error');
		}

		// 更新処理
		try {
			// 一時テーブルの該当レコードを取得
			await refreshTempResources(session.sessionId, exam);
			const res = await db.tempResource.findMany({
				where: {
					id: {
						in: form.data.checked
					}
				}
			});
			// 一時テーブルのレコードを削除
			await db.tempResource.deleteMany({
				where: {
					sessionId: session.sessionId,
					examType
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
		} catch (e) {
			console.log(e);
			return fail(400, { form: { ...form, message: 'DB更新エラー' } });
		}
		return { form };
	}
};
