import { URLS } from '$lib/consts';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import fs from 'node:fs';
import path from 'node:path';
import type { ArchiveItem } from '@prisma/client';

function searchFiles(dirPath: string, re: RegExp): string[] {
  const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });

  const files: string[] = [];
  for (const dirent of allDirents) {
    if (dirent.isDirectory()) {
      const subDirPath = path.join(dirPath, dirent.name);
      files.push(...searchFiles(subDirPath, re));
    } else if (dirent.isFile()) {
      if (dirent.name.toLowerCase().match(re)) {
        files.push(path.join(dirPath, dirent.name));
      }
    }
  }

  return files;
}

function getItemProps(itemPath: string) {
  // todo: パスから各種プロパティを取得
  const props: Omit<ArchiveItem, 'id' | 'archiveId'> = {
    title: path.basename(itemPath),
    state: 'deny',
    path: itemPath,
    year: null,
    strYear: null,
    grade: null,
    strGrade: null,
    sequence: null,
    strSequence: null,
  }
  const yearMatch = itemPath.match(/(\d{4})(年|年度)/);
  if (yearMatch) {
    props.year = parseInt(yearMatch[1]);
    props.strYear = yearMatch[0]
  }
  const gradeMatch = itemPath.match(/(小|中|高|準)(\d)級?/);
  if (gradeMatch) {
    props.grade = parseInt(gradeMatch[2]);
    props.strGrade = gradeMatch[0];
    if (gradeMatch[1] === '中') {
      props.grade += 6;
    }
    else if (gradeMatch[1] === '高') {
      props.grade += 9;
    }
    else if (gradeMatch[1] === '準') {
      props.grade = props.grade * 10 + 5
    }
    else if (gradeMatch[0].endsWith('級')) {
      props.grade *= 10
    }
  }
  const sequenceMatch = itemPath.match(/第?(\d{1,2})(回|月|月号)/);
  if (sequenceMatch) {
    props.sequence = parseInt(sequenceMatch[1]);
    props.strSequence = sequenceMatch[0];
  }

  if (props.title.endsWith('.mp3')) {
    if (props.strSequence?.includes('月')) {
      if (props.title.includes('国語')) {
        props.title = '国語 聞き取り問題'
      }
      else if (props.title.includes('英語')) {
        props.title = '英語 リスニング問題'
      }
    }
  }
  else if (props.strGrade?.match(/準|級/)) {
    const m = props.title.match(/^(p?)(\d)q-?part(?<part>\d).mp3$/i);
    if (m && m.groups) {
      const part = Number(m.groups.part);
      props.title = `リスニング音源(Part${part})`;
    }

  }


  return props
}


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

  const re = /\.(mp3|pdf)$/
  const diskItems = searchFiles(archive.path, re)
  try {
    for (const diskItem of diskItems) {
      const itemPath = diskItem.replace(archive.path, '')
      const item = await db.archiveItem.findUnique({
        where: {
          archiveId_path: {
            archiveId: archive.id,
            path: itemPath
          }
        }
      })
      if (!item) {
        await db.archiveItem.create({
          data: {
            ...getItemProps(itemPath),
            archiveId: archive.id
          }
        })
      }
    }
  } catch (e) {
    console.error(e)
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