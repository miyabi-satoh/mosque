import { error } from '@sveltejs/kit';

import mime from 'mime';
import fs from 'node:fs';
import path from 'node:path';

import { CTEST_MEDIA_CSV } from '$env/static/private';

import { findByHead } from '$lib/server/utils';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	let key = url.searchParams.get('key');
	if (key === null) {
		throw error(400, `Invalid`);
	}
	key = decodeURIComponent(key);

	const data = findByHead(CTEST_MEDIA_CSV, key);
	if (data) {
		if (!fs.existsSync(data.path)) {
			console.log(data.path);
			throw error(404, `Not found, ${data.path}`);
		}
		const stats = fs.statSync(data.path);
		const filename = path.basename(data.path);
		const contentType = mime.getType(data.path);
		if (!contentType) {
			throw error(415, `Unsupported Media Type, ${data.path}`);
		}
		return new Response(fs.readFileSync(data.path), {
			status: 200,
			headers: {
				'Content-Type': contentType,
				'Content-Length': `${stats.size}`,
				'Content-Disposition': `inline; filename=${encodeURI(filename)}`,
				// これが無いとシーク不可になる
				'Accept-Ranges': 'bytes'
			}
		});
	}

	throw error(404, `Not found, ${key}`);
};
