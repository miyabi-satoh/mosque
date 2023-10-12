import { error, fail, redirect } from '@sveltejs/kit';

import type { Exam, ExamTypeEnum, TempResource } from '@prisma/client';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

import { CTEST_RESOURCE_DIR, EIKEN_RESOURCE_DIR, KYOTE_RESOURCE_DIR } from '$env/static/private';

import { getExamConfig } from '$lib/exam';
import { ResourceSchema } from '$lib/schemas/zod';
import { db, type PrismaInnerTransaction } from '$lib/server/db';
import { searchFiles } from '$lib/server/utils';
import { convertFullWidthNumbersToHalf, exclude } from '$lib/utils';

import type { Actions, PageServerLoad } from './$types';

type ResourceRequiredKeys = keyof Pick<TempResource, 'id' | 'path' | 'state' | 'year'>;
type ResourceOptionalKeys = keyof Pick<
	TempResource,
	'grade' | 'numOf' | 'publisher' | 'shortTitle'
>;
type ColumnValues = {
	[key in ResourceRequiredKeys]: string;
} & {
	[key in ResourceOptionalKeys]?: string;
};

const schema = z.object({
	checked: z.string().array()
});
const parseSchema = ResourceSchema.pick({
	year: true,
	grade: true,
	numOf: true,
	publisher: true,
	category: true,
	title: true,
	shortTitle: true,
	path: true
});

function getBaseDir(exam: Exam): string {
	return (() => {
		switch (exam.examType) {
			case 'ctest':
				return CTEST_RESOURCE_DIR;
			case 'eiken':
				return EIKEN_RESOURCE_DIR;
			case 'kyote':
				return KYOTE_RESOURCE_DIR;
		}
	})()
		.split(path.sep)
		.join(path.sep);
}

async function refreshTempResources(
	db: PrismaInnerTransaction,
	sessionId: string,
	exam: Exam
): Promise<void> {
	// clear resouce-temp
	await db.tempResource.deleteMany({
		where: {
			sessionId,
			examType: exam.examType
		}
	});

	const config = getExamConfig(exam);
	const baseDir = getBaseDir(exam);
	const files = searchFiles(baseDir, /\.(mp3|pdf)$/).sort();
	const convertPath = (file: string) => {
		const convertedPath = convertFullWidthNumbersToHalf(file).toLowerCase();
		const convertedFile = path.basename(file);
		const convertedDir = convertedPath.slice(
			baseDir.length + 1,
			convertedPath.length - convertedFile.length - 1
		);
		return {
			convertedDir,
			convertedFile
		};
	};

	for (const file of files) {
		let res = {} as TempResource;
		const { convertedDir, convertedFile } = convertPath(file);

		// 変換後のディレクトリ名から類推
		convertedDir.split(path.sep).forEach((pathItem) => {
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
					} else {
						res.publisher = pathItem.toUpperCase();
					}
				}
			}
		});

		const filename = path.basename(convertedFile);
		res = {
			...res,
			...config.parse(filename),
			publisher: res.publisher ?? '',
			path: file,
			id: createHash('sha256').update(file).digest('hex')
		};

		if (parseSchema.safeParse(res).success) {
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
		} else {
			console.log('invalid data', res);
		}
	}
}

export const load = (async ({ locals, params, parent, url }) => {
	const session = await locals.auth.validate();
	if (!session) {
		throw redirect(302, '/');
	}

	const examType = params.type.toLowerCase() as ExamTypeEnum;
	const exam = await db.exam.findUnique({ where: { examType: examType } });
	if (!exam) {
		console.error(`Cannot read exam(examType = '${examType}')`);
		throw error(500, 'Internal Server Error');
	}

	const data = await parent();
	data.breadcrumbs.push({ label: `${exam.name} ファイル管理`, link: url.pathname });

	const tempData = await db.$transaction(
		async (db) => {
			// refresh resouce-temp
			await refreshTempResources(db, session.sessionId, exam);

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
					{ category: 'asc' },
					{ title: 'asc' }
				]
			});
			await db.tempResource.deleteMany({
				where: {
					sessionId: session.sessionId,
					examType
				}
			});

			return tempData;
		},
		{
			timeout: 1000 * 60 * 5 // 5 min
		}
	);

	const config = getExamConfig(exam);
	const baseDir = getBaseDir(exam);
	const initialData = {
		checked: [] as string[]
	};
	const columnValues = tempData.map((data) => {
		if (data.path.startsWith(baseDir)) {
			data.path = data.path.slice(baseDir.length);
			while (data.path.startsWith(path.sep)) {
				data.path = data.path.slice(1);
			}
		} else {
			data.path = '...' + path.sep + path.basename(data.path);
		}
		if (data.state === 'ok') {
			initialData.checked.push(data.id);
		}
		return {
			...data,
			year: config.labelYear(data.year),
			numOf: config.labelNumOf(data.numOf),
			grade: config.labelGrade(data.grade)
		} satisfies ColumnValues;
	});

	const form = await superValidate(initialData, schema);

	return {
		form,
		columnValues,
		columnLabels: config.columnLabels,
		exam
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals, params }) => {
		// get session
		const session = await locals.auth.validate();
		if (!session) {
			throw redirect(302, '/');
		}

		// validate form data
		const formData = await request.formData();
		const form = await superValidate(formData, schema);
		if (!form.valid) {
			return fail(400, { form });
		}

		const examType = params.type.toLowerCase() as ExamTypeEnum;
		const exam = await db.exam.findUnique({ where: { examType: examType } });
		if (!exam) {
			console.error(`Cannot read exam(examType = '${examType}')`);
			throw error(500, 'Internal Server Error');
		}

		// 更新処理
		try {
			await db.$transaction(
				async (db) => {
					// 一時テーブルの該当レコードを取得
					await refreshTempResources(db, session.sessionId, exam);
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
				},
				{
					timeout: 1000 * 60 * 5
				}
			);
		} catch (e) {
			console.log(e);
			return message(form, 'Failed to update database.', {
				status: 400
			});
		}
		return message(form, 'Updated database successfully.');
	}
};
