import { error, json } from '@sveltejs/kit';
import { addWeeks } from 'date-fns';
import type { Nullable } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'crypto';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
// import { PRINTER_NAME } from '$env/static/private';

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
	// console.log(PRINTER_NAME);
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

	// const script = path.join('scripts', 'printout.ps1');
	// const spawn = spawnSync(`pwsh ${script} "${filepath}" "${PRINTER_NAME}"`, { shell: true });
	const spawn = spawnSync(`pwsh -v`, { shell: true });
	console.log(`stdout: ${spawn.stdout}`);
	console.log(`stderr: ${spawn.stderr}`);
	console.log(`status: ${spawn.status}`);
	return json({
		success: spawn.status === 0
	});
}) satisfies RequestHandler;
