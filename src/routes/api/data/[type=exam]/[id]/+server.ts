import { error } from '@sveltejs/kit';

import type { ExamTypeEnum } from '@prisma/client';
import mime from 'mime';
import fs from 'node:fs';
import path from 'node:path';

import { db } from '$lib/server/db';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const id = params.id;
	const examType = params.type as ExamTypeEnum;
	const res = await db.resource.findUnique({
		where: { id_examType: { id, examType } }
	});
	if (res) {
		if (!fs.existsSync(res.path)) {
			console.log(res.path);
			throw error(404, `Not found, ${res.path}`);
		}
		const stats = fs.statSync(res.path);
		const filename = path.basename(res.path);
		const contentType = mime.getType(res.path);
		if (!contentType) {
			throw error(415, `Unsupported Media Type, ${res.path}`);
		}
		return new Response(fs.readFileSync(res.path), {
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

	throw error(404, 'Not Found');
};
