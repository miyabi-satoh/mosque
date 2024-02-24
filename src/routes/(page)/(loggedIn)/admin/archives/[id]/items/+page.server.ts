import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { ArchiveItemSchema } from '$lib/schemas/zod';

function searchFiles(dirPath: string): string[] {
  const allDirents = readdirSync(dirPath, { withFileTypes: true });

  const files: string[] = [];
  for (const dirent of allDirents) {
    if (dirent.isDirectory()) {
      const subDirPath = path.join(dirPath, dirent.name);
      files.push(...searchFiles(subDirPath));
    } else if (dirent.isFile()) {
      files.push(path.join(dirPath, dirent.name));
    }
  }

  return files;
}

const schema = ArchiveItemSchema.pick({
  strGrade: true,
  strSequence: true,
  strYear: true,
  title: true
}).extend({
  id: ArchiveItemSchema.shape.id.optional()
})

export const load = (async ({ parent, params }) => {
  const data = await parent();
  data.breadcrumbs.push({
    label: 'Items',
    link: URLS.ADMIN_ARCHIVE_ITEMS('new')
  });

  const archive = await db.archive.findUnique({
    where: { id: params.id }
  })
  if (!archive) error(404, 'Archive not found.');

  const diskItems = searchFiles(archive.path)
  try {
    for (const path of diskItems) {
      const item = await db.archiveItem.findUnique({
        where: {
          archiveId_path: {
            archiveId: archive.id,
            path
          }
        }
      })
      if (!item) {
        // todo: パスから各種プロパティを取得
      }
    }
  }

  const items = Array.from(new Set([
    ...archive.items.map(i => i.path),
    ...diskItems
  ])).map(p => {
    const foundDb = archive.items.find(i => i.path === p)
    const foundDisk = diskItems.find(i => i === p)
    // pathが同じならdb優先
    if (foundDb && foundDisk) return foundDb
    // dbにあるがdiskにない
    if (foundDb) { }
    // diskにあるがdbにない
    if (foundDisk) { }
  })
  return {};
}) satisfies PageServerLoad;