import fs from 'node:fs';
import path from 'node:path';
import { createTransport } from 'nodemailer';

import { MAIL_ACCOUNT, MAIL_PASSWORD } from '$env/static/private';

export function searchFiles(dirPath: string, ext: RegExp): string[] {
	const allDirents = fs.readdirSync(dirPath, { withFileTypes: true });

	const files: string[] = [];
	for (const dirent of allDirents) {
		if (dirent.isDirectory()) {
			const subDirPath = path.join(dirPath, dirent.name);
			files.push(...searchFiles(subDirPath, ext));
		} else if (dirent.isFile()) {
			if (dirent.name.match(ext)) {
				files.push(path.join(dirPath, dirent.name));
			}
		}
	}

	return files;
}

export async function sendmail(to: string, subject: string, text: string): Promise<void> {
	const transporter = createTransport({
		port: 465,
		host: 'smtp.gmail.com',
		secure: true,
		auth: {
			user: MAIL_ACCOUNT,
			pass: MAIL_PASSWORD
		}
	});

	await transporter.sendMail({
		from: MAIL_ACCOUNT,
		to,
		subject,
		text
	});
}
