import { error } from '@sveltejs/kit';

import mime from 'mime';
import fs from 'node:fs';
import path from 'node:path';

import { db } from '$lib/server/db';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const item = await db.archiveItem.findUnique({
		where: { id: params.id },
		include: { archive: true }
	});
	if (!item) error(404, 'Not Found');

	const fullPath = path.join(item.archive.root, item.path);
	if (!fs.existsSync(fullPath)) {
		// todo:
		error(404, `Not found, ${fullPath}`);
	}
	const stats = fs.statSync(fullPath);
	const filename = path.basename(fullPath);
	const contentType = mime.getType(fullPath);
	if (!contentType) {
		error(415, `Unsupported Media Type, ${fullPath}`);
	}
	return new Response(fs.readFileSync(fullPath), {
		status: 200,
		headers: {
			'Content-Type': contentType,
			'Content-Length': `${stats.size}`,
			'Content-Disposition': `inline; filename=${encodeURI(filename)}`,
			// これが無いとシーク不可になる
			'Accept-Ranges': 'bytes'
		}
	});
};
