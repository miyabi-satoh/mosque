import { error, fail } from '@sveltejs/kit';

import type { ArchiveItem } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';

import type { Actions, PageServerLoad } from './$types';

/**
 * 指定されたディレクトリ内のファイルを再帰的に検索します
 * @param dirPath 検索するディレクトリのパス
 * @param re 検索するファイル名の正規表現
 * @param depth 検索する深さの制限値（デフォルトは無制限）
 * @returns マッチしたファイルのパスの配列
 */
function searchFiles(dirPath: string, re: RegExp, depth: number = Infinity): string[] {
	if (depth === 0) {
		return [];
	}

	const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });

	const files: string[] = [];
	for (const dirent of allDirents) {
		if (dirent.isDirectory()) {
			const subDirPath = path.join(dirPath, dirent.name);
			files.push(...searchFiles(subDirPath, re, depth - 1));
		} else if (dirent.isFile()) {
			if (dirent.name.toLowerCase().match(re)) {
				files.push(path.join(dirPath, dirent.name));
			}
		}
	}

	return files;
}

/**
 * アイテムのプロパティを取得します
 * @param itemPath アイテムのパス
 * @returns アイテムのプロパティ
 */
function getItemProps(itemPath: string) {
	const props: Omit<ArchiveItem, 'id' | 'archiveId' | 'published'> = {
		title: path.basename(itemPath),
		path: itemPath,
		year: null,
		strYear: null,
		grade: null,
		strGrade: null,
		section: null,
		strSection: null
	};
	const paths = itemPath.split(path.sep).slice(0, -1);

	// year: 年(度)を取得します
	paths.find((path) => {
		const yearMatch = path.match(/^(\d{4})(年|年度)?$/i);
		if (yearMatch) {
			props.year = parseInt(yearMatch[1]);
			props.strYear = yearMatch[0];
			return true;
		}
		return false;
	});

	// grade: 学年または級を取得します
	paths.find((path) => {
		const gradeMatch = path.match(/^((?<p1>小|中|高)(?<g1>\d))|((?<p2>準)?(?<g2>\d)級)$/i);
		if (gradeMatch && gradeMatch.groups) {
			props.strGrade = gradeMatch[0];
			if (gradeMatch.groups.g1) {
				props.grade = parseInt(gradeMatch.groups.g1);
				if (gradeMatch.groups.p1 === '中') {
					props.grade += 6;
				} else if (gradeMatch.groups.p1 === '高') {
					props.grade += 9;
				}
			} else if (gradeMatch.groups.g2) {
				props.grade = parseInt(gradeMatch.groups.g2) * 10;
				if (gradeMatch.groups.p2 === '準') {
					props.grade += 5;
				}
			}
			return true;
		}
		return false;
	});

	// section: 実施月・実施回・[]で囲まれた文字列を取得します
	paths.find((path) => {
		const sectionMatch = path.match(/^第?(\d{1,2})(回|月号?)$/i);
		if (sectionMatch) {
			props.section = parseInt(sectionMatch[1]);
			if (props.strYear?.match(/年度$/i) && sectionMatch[2] != '回' && props.section < 4) {
				props.section += 12;
			}
			props.strSection = sectionMatch[0];
			return true;
		} else if (path.match(/^\[(.*)\]$/i)) {
			props.section = 0;
			props.strSection = path.slice(1, -1);
			return true;
		}
		return false;
	});

	// タイトルを取得します
	if (props.title.match(/\.mp3$/)) {
		if (props.strSection?.includes('月')) {
			if (props.title.includes('国語')) {
				props.title = '国語 聞き取り問題';
			} else if (props.title.includes('英語')) {
				props.title = '英語 リスニング問題';
			}
		} else if (props.strGrade?.match(/準|級/)) {
			const partMatch = props.title.match(/^p?\dq-?part(\d).mp3$/i);
			if (partMatch) {
				const part = parseInt(partMatch[1]);
				props.title = `リスニング音源(Part${part})`;
			}
		}
	} else if (props.title.match(/\.pdf$/)) {
		// <問題>
		// 2020-2-1ji-1kyu.pdf
		// 2020-2-1ji-p2kyu.pdf
		// <解答>
		// 1kyu.pdf
		// p2kyu-sun.pdf
		// 2kyu-sunc.pdf
		// 2023-2-p2kyu.pdf
		const titleMatch = props.title.match(/^(\d{4}-\d-(?<ans>1ji-)?)?p?\dkyu(-sunc?)?.pdf$/i);
		if (titleMatch && titleMatch.groups) {
			props.title = titleMatch.groups.ans ? '解答' : '問題冊子';
		}
	}

	return props;
}
const schema = z.object({
	checked: z.string().array()
});

export const load: PageServerLoad = async ({ parent, params }) => {
	const data = await parent();
	data.breadcrumbs.push({
		label: 'Items',
		link: URLS.ADMIN_ARCHIVE_ITEMS('new')
	});

	const archive = await db.archive.findUnique({
		where: { id: params.id },
		include: {
			items: true
		}
	});
	if (!archive) error(404, 'Archive not found.');

	const re = /\.(mp3|pdf)$/;
	const diskItems = searchFiles(archive.root, re, archive.depth);
	try {
		await db.$transaction(async (prisma) => {
			// ディスク上のアイテムとデータベース内のアイテムを比較し、不足しているアイテムを削除します。
			const missingItems = archive.items.filter(
				(item) => !diskItems.includes(path.join(archive.root, item.path))
			);
			await prisma.archiveItem.deleteMany({
				where: {
					id: {
						in: missingItems.map((item) => item.id)
					}
				}
			});

			// ディスク上にもデータベースにもあるアイテムについては、プロパティを更新します。
			const existingItems = archive.items.filter((item) =>
				diskItems.includes(path.join(archive.root, item.path))
			);
			for (const item of existingItems) {
				await prisma.archiveItem.update({
					where: { id: item.id },
					data: {
						...getItemProps(item.path)
					}
				});
			}

			// ディスク上に存在するがデータベースにないアイテムについては、新たにデータベースに追加します。
			// この処理により、データベースのアイテムリストが最新の状態に保たれます。
			const existingItemPaths = archive.items.map((item) => path.join(archive.root, item.path));
			const newItems = diskItems.filter((diskItem) => !existingItemPaths.includes(diskItem));
			for (const newItemPath of newItems) {
				const relativePath = newItemPath.replace(archive.root, '');
				await prisma.archiveItem.create({
					data: {
						archiveId: archive.id,
						published: false,
						...getItemProps(relativePath)
					}
				});
			}
		});
	} catch (e) {
		console.error(e);
	}

	const items = await db.archiveItem.findMany({
		where: { archiveId: archive.id },
		orderBy: [{ year: 'desc' }, { section: 'desc' }, { grade: 'asc' }, { title: 'asc' }]
	});

	const checked = items.filter((item) => item.published).map((item) => item.id);
	const form = await superValidate({ checked }, zod(schema));

	return { items, form };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const form = await superValidate(request, zod(schema));
		if (!form.valid) return fail(400, { form });

		try {
			await db.$transaction(async (prisma) => {
				// チェックされたアイテムの状態を更新
				await prisma.archiveItem.updateMany({
					where: { id: { in: form.data.checked } },
					data: { published: true }
				});

				// チェックされていないアイテムの状態を更新
				await prisma.archiveItem.updateMany({
					where: {
						NOT: {
							id: { in: form.data.checked }
						},
						archiveId: params.id
					},
					data: { published: false }
				});
			});
			return message(form, 'Success!');
		} catch (e) {
			console.error(e);
		}

		return message(form, 'Failed to update the database', {
			status: 403
		});
	}
};
