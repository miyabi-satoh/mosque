import { error, json } from '@sveltejs/kit';
import { addWeeks } from 'date-fns';
import type { Nullable } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'crypto';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

const findCache = (dirname: string): string | null => {
	try {
		const dirents = fs.readdirSync(dirname, {
			withFileTypes: true
		});

		for (const dirent of dirents) {
			if (dirent.isFile()) {
				// ファイルの更新日時を取得
				const file = path.join(dirname, dirent.name);
				const stats = fs.statSync(file);
				// 期間を比較
				if (addWeeks(stats.mtime, 4) > new Date()) {
					return file;
				}
				fs.unlinkSync(file);
			}
		}
	} catch (err) {
		/* empty */
	}
	return null;
};

export const GET = (async ({ params }) => {
	const asset = await prisma.asset.findUnique({
		where: {
			id: Number(params.id)
		}
	});
	if (!asset) {
		throw error(404, 'Invalid asset');
	}
	if (!asset.uri) {
		throw error(404, 'Invalid uri');
	}

	let filepath: Nullable<string> = null;
	if (asset.uri.match(/^https?:\/\//)) {
		const hs = createHash('md5').update(asset.uri).digest('hex');
		const dirname = path.join('cache', hs);
		filepath = findCache(dirname);
	} else if (fs.existsSync(asset.uri)) {
		filepath = asset.uri;
	}

	if (!filepath) {
		throw error(404, 'Not found');
	}

	return json({
		success: filepath
	});
}) satisfies RequestHandler;
