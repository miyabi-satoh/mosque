import { error } from '@sveltejs/kit';
import { addWeeks } from 'date-fns';
import mime from 'mime/lite';
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { createHash } from 'crypto';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

const download = async (uri: string, dirname: string): Promise<void> => {
	return await new Promise<void>((resolve, reject) =>
		https
			.get(uri, (res) => {
				const code = res.statusCode ?? 0;
				console.log(`code: ${code}`);
				if (code >= 400) {
					return reject(new Error(res.statusMessage));
				}

				// handle redirects
				if (code > 300 && !!res.headers.location) {
					return resolve(download(res.headers.location, dirname));
				}
				const contentDisposition = res.headers['content-disposition'];
				console.log(`content-disposition: ${contentDisposition}`);
				let filename = '';
				if (contentDisposition) {
					filename = contentDisposition.split(';')[1].split('=')[1];
				}
				if (!filename) {
					filename = path.basename(uri);
				}

				const filepath = path.join(dirname, filename);
				console.log(`filepath: ${filepath}`);
				const fileWriter = fs.createWriteStream(filepath);
				fileWriter.on('finish', () => resolve());
				fileWriter.on('error', (error) => {
					fileWriter.close();
					fs.unlink(filepath, () => reject(error));
				});
				res.pipe(fileWriter);
			})
			.on('error', (error) => {
				reject(error);
			})
	);
};

const findCache = (dirname: string): string | null => {
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

	if (fs.existsSync(asset.uri)) {
		// 実ファイルはそのまま送信
		const filename = path.basename(asset.uri);
		return new Response(fs.readFileSync(asset.uri), {
			status: 200,
			headers: {
				'Content-Type': mime.getType(filename) ?? 'text/plain',
				'Content-Disposition': `inline; filename=${filename}`
			}
		});
	}

	// Webリソースはキャッシュを生成
	if (asset.uri.match(/^https?:\/\//)) {
		// URLのハッシュ値を取得
		const hs = createHash('md5').update(asset.uri).digest('hex');
		const dirname = path.join('cache', hs);
		if (findCache(dirname) === null) {
			fs.mkdirSync(dirname, { recursive: true });

			try {
				await download(asset.uri, dirname);
			} catch (err) {
				console.log('download error');
				console.log(err);
			}
		}

		const filepath = findCache(dirname);
		if (filepath) {
			const filename = path.basename(filepath);
			return new Response(fs.readFileSync(filepath), {
				status: 200,
				headers: {
					'Content-Type': mime.getType(filename) ?? 'text/plain',
					'Content-Disposition': `inline; filename=${filename}`
				}
			});
		}
	}

	throw error(404, 'Invalid asset');
}) satisfies RequestHandler;
