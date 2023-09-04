import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { findMediaData } from '$lib/server/utils.eiken';
import fs from 'node:fs';
import path from 'node:path';
import mime from 'mime';

export const GET: RequestHandler = async ({ url }) => {
	let key = url.searchParams.get('key');
	if (key === null) {
		throw error(400, `Invalid`);
	}
	key = decodeURIComponent(key);

	const data = findMediaData(key);
	if (!data) {
		throw error(400, `Invalid`);
	}

	if (fs.existsSync(data.path)) {
		const stats = fs.statSync(data.path);
		const filename = path.basename(data.path);
		const contentType = mime.getType(data.path);
		if (contentType !== null) {
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
	}

	throw error(400, `Invalid`);
};
