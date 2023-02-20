import { addWeeks } from 'date-fns';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'crypto';
import type { PageServerLoad } from './$types';

const download = async (uri: string, filename: string) => {
	// URLのハッシュ値を取得
	const hs = createHash('md5').update(uri).digest('hex');
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
		// return stats.mtime;
		// 期間を比較
		// today = datetime.datetime.now()
		// span = datetime.timedelta(weeks=4)
		if (addWeeks(stats.mtime, 4) > new Date()) {
			// cache 有効
		}
	});

	return new Promise<void>((resolve, reject) =>
		https
			.request(uri, (res) => {
				console.log(res.headers);
				res.pipe(fs.createWriteStream(filename)).on('close', resolve).on('error', reject);
			})
			.end()
	);
};

export const load = (async () => {
	await download(
		'https://cdn-ak.f.st-hatena.com/images/fotolife/K/Keisuke69/20221006/20221006180406.png',
		'20221006180406.png'
		// ).then(() => console.log('done'));
	);

	const dummy = 'dummy';
	return {
		dummy
	};
}) satisfies PageServerLoad;
