import { error } from '@sveltejs/kit';
import { addWeeks } from 'date-fns';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'crypto';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

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

	if (fs.existsSync(asset.uri)) {
		// 実ファイルはそのまま送信
		const filename = path.basename(asset.uri);
		return new Response(fs.readFileSync(asset.uri), {
			status: 200,
			headers: {
				'Content-Disposition': `inline; filename=${filename}`
			}
		});
	}

	// Webリソースはキャッシュを生成
	if (asset.uri.match(/^https?:\/\//)) {
		// URLのハッシュ値を取得
		const hs = createHash('md5').update(asset.uri).digest('hex');
		let filepath = 'cache';
		// キャッシュ用のディレクトリを用意
		if (!fs.existsSync(filepath)) {
			fs.mkdirSync(filepath);
		}
		filepath = path.join(filepath, hs);
		if (!fs.existsSync(filepath)) {
			fs.mkdirSync(filepath);
		}
		// ディレクトリ内のファイルを取得
		fs.readdirSync(filepath).forEach((file) => {
			// ファイルの更新日時を取得
			const stats = fs.statSync(file);
			// 期間を比較
			if (addWeeks(stats.mtime, 4) > new Date()) {
				// cache 有効
			}
		});
	}

	const filename = '20221006180406.png';
	const body = fs.readFileSync(filename);
	return new Response(body, {
		status: 200,
		headers: {
			'Content-type': 'image/png',
			'Content-Disposition': `attachment; filename=${filename}`
		}
	});
}) satisfies RequestHandler;
