import { error, fail, redirect } from '@sveltejs/kit';

import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

import { URLS } from '$lib/consts';
import { ArchiveSchema } from '$lib/schemas/zod';
import { db } from '$lib/server/db';

import type { PageServerLoad } from './$types';

const crudSchema = ArchiveSchema.extend({
	id: ArchiveSchema.shape.id.optional()
});
const itemSchema = z.object({
	name: z.string(),
	isDir: z.boolean(),
	size: z.number().optional(),
	mtime: z.coerce.date().optional()
});
type ItemT = z.infer<typeof itemSchema>;
// const schema = z.object({
// 	currentDir: z.string(),
// 	items: itemSchema.array()
// });

function readdir(currentDir: string): ItemT[] {
	const items: ItemT[] = readdirSync(currentDir)
		.map((file) => {
			const stat = statSync(path.join(currentDir, file));
			return {
				name: file,
				isDir: stat.isDirectory(),
				size: stat.size,
				mtime: stat.mtime
			} satisfies ItemT;
		})
		.sort((a, b) => {
			if (a.isDir && !b.isDir) return -1;
			if (!a.isDir && b.isDir) return 1;
			if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
			if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;

			return 0;
		});

	const parentDir = path.dirname(currentDir);
	console.log(parentDir);
	if (parentDir !== currentDir) {
		items.unshift({
			name: '..',
			isDir: true,
			size: undefined,
			mtime: undefined
		});
	}

	return items;
}
export const load = (async ({ parent }) => {
	console.log('load');
	const id = /*params.id*/ 'dummy';

	const data = await parent();
	data.breadcrumbs.push({
		label: '設定',
		link: URLS.ADMIN_ARCHIVES(id)
	});

	const archive = await db.archive.findUnique({
		where: { id }
	});
	if (!archive) error(404, 'Archive not found.');

	const currentDir = process.cwd();
	const items = readdir(currentDir);

	// const form = await superValidate({ currentDir, items }, schema);

	return { currentDir, items, archive };
	// return { form, archive };
}) satisfies PageServerLoad;

export const actions = {
	cd: async () => {
		console.log('cd');
		// const id = params.id;
		// const formData = await request.formData();
		// const baseDir = formData.get('currentDir')?.toString() ?? process.cwd();
		// const targetDir = formData.get('targetDir')?.toString() ?? '';
		// const currentDir = path.join(baseDir, targetDir);
		// try {
		// 	await db.archive.update({
		// 		where: { id },
		// 		data: {
		// 			lastDir: currentDir
		// 		}
		// 	});
		// } catch (e) {
		// 	console.error(e);
		// }
		return {};

		// const items = readdir(currentDir);
		// const form = await superValidate({ currentDir, items }, schema);
		// if (!form.valid) return fail(400, { form });

		// return { form };
	},
	add: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(crudSchema));
		if (!form.valid) return fail(400, { form });

		const id = form.data.id;
		const data = form.data;

		if (!id) {
			// CREATE archive
			try {
				await db.archive.create({ data });
			} catch (e) {
				console.error(e);
				return fail(400, { form: { ...form, message: 'Failed to create archive.' } });
			}
			return message(form, 'Archive created!');
		} else {
			if (formData.has('delete')) {
				// DELETE archive
				try {
					await db.archive.delete({
						where: { id }
					});
				} catch (e) {
					console.error(e);
					return fail(400, { form: { ...form, message: 'Failed to delete archive.' } });
				}
				redirect(303, URLS.ADMIN_ARCHIVES());
			} else {
				// UPDATE archive
				try {
					await db.archive.update({
						where: { id },
						data
					});
				} catch (e) {
					console.error(e);
					return fail(400, { form: { ...form, message: 'Failed to update archive.' } });
				}
				return message(form, 'Archive updated!');
			}
		}
	}
};
