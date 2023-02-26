import { error } from '@sveltejs/kit';
import mime from 'mime';
import type { Asset } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'crypto';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

type Fetch = typeof fetch;
const download = async (
	fetch: Fetch,
	asset: Asset,
	uri: string,
	dirname: string
): Promise<string> => {
	const res = await fetch(uri);
	const code = res.status ?? 0;
	if (code >= 400) {
		// キャッシュが残っていれば、それを使用する
		if (asset.cache && fs.existsSync(asset.cache)) {
			return asset.cache;
		}
		console.log(`code: ${code}`);
		throw new Error(res.statusText);
	}

	// handle redirects
	if (code > 300) {
		const location = res.headers.get('location');
		console.log(`code: ${code}`);
		console.log(`location: ${location}`);
		if (location) {
			return await download(fetch, asset, location, dirname);
		}
	}

	const lastModified = res.headers.get('Last-Modified');
	if (lastModified) {
		const dt = new Date(lastModified);
		if (dt.getTime() == asset.lastModified?.getTime()) {
			// 前回取得時から変更なし
			if (asset.cache && fs.existsSync(asset.cache)) {
				// キャッシュファイルも残っている -> 処理不要
				console.log(`Use cache: ${asset.cache}`);
				return asset.cache;
			}
		}
		asset.lastModified = dt;
	}

	// 以前のキャッシュがあれば削除
	if (asset.cache && fs.existsSync(asset.cache)) {
		fs.unlinkSync(asset.cache);
	}

	const contentDisposition = res.headers.get('content-disposition');
	console.log(`content-disposition: ${contentDisposition}`);
	let filename = '';
	if (contentDisposition) {
		filename = contentDisposition.split(';')[1].split('=')[1];
	}
	if (!filename) {
		filename = path.basename(uri).replace(/\?.*$/, '');
	}

	fs.mkdirSync(dirname, { recursive: true });
	asset.cache = path.join(dirname, filename);
	fs.writeFileSync(asset.cache, Buffer.from(await res.arrayBuffer()));
	await prisma.asset.update({
		where: {
			id: asset.id
		},
		data: {
			lastModified: asset.lastModified,
			cache: asset.cache
		}
	});
	return asset.cache;
};

const convert = async (asset: Asset, filepath: string) => {
	const stats = fs.statSync(filepath);
	if (asset.cache && fs.existsSync(asset.cache)) {
		if (stats.mtime.getTime() == asset.lastModified?.getTime()) {
			return asset.cache;
		}
	}

	const filename = path.basename(filepath).replace(/\.(doc|xls|ppt)[xm]?$/, '.pdf');
	const hs = createHash('md5').update(filepath).digest('hex');
	const out = path.join('cache', hs, filename);
	const script = path.join('scripts', 'office2pdf.ps1');
	const spawn = spawnSync(`pwsh ${script} "${filepath}" "${out}"`, { shell: true });
	if (spawn.status === 0) {
		await prisma.asset.update({
			where: {
				id: asset.id
			},
			data: {
				lastModified: stats.mtime,
				cache: out
			}
		});
		return out;
	}
	console.log(`status: ${spawn.status}`);
	console.log(`stdout: ${spawn.stdout}`);
	console.log(`stderr: ${spawn.stderr}`);

	return filepath;
};

export const GET = (async ({ params, fetch }) => {
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

	let filepath: string | null = null;

	// Webリソースはキャッシュを生成
	if (asset.uri.match(/^https?:\/\//)) {
		// URLのハッシュ値を取得
		const hs = createHash('md5').update(asset.uri).digest('hex');
		const dirname = path.join('cache', hs);

		try {
			filepath = await download(fetch, asset, asset.uri, dirname);
		} catch (err) {
			console.log('download error');
			console.log(err);
		}
	}
	// ローカルリソースはそのまま送信
	else if (fs.existsSync(asset.uri)) {
		filepath = asset.uri;
	}

	// office文書はインライン表示できないため、pdfに変換する
	if (filepath && filepath.match(/\.(doc|xls|ppt)[xm]?$/)) {
		filepath = await convert(asset, filepath);
	}

	if (filepath && fs.existsSync(filepath)) {
		const stats = fs.statSync(filepath);
		const filename = path.basename(filepath);
		const contentType = mime.getType(filename) ?? 'text/plain';
		let headers = {};
		headers = {
			'Content-Type': contentType,
			'Content-Length': stats.size,
			'Content-Disposition': `inline; filename=${encodeURI(filename)}`
		};
		if (contentType.startsWith('audio/')) {
			headers = {
				...headers,
				'Accept-Ranges': 'bytes'
			};
		}
		return new Response(fs.readFileSync(filepath), {
			status: 200,
			headers
		});
	}

	throw error(404, 'Invalid asset');
}) satisfies RequestHandler;
