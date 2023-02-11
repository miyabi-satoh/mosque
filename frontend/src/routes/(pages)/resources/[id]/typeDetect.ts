import type { BlobType } from '$schemas';

export function typeDetect(typeStr: string): BlobType {
	const table: Record<string, BlobType> = {
		'application/json': 'text',
		'application/x-tex': 'text',
		'application/pdf': 'pdf',
		'application/x-httpd-php': 'text',
		'application/x-sh': 'text'
	};

	typeStr = typeStr.toLowerCase();
	if (table[typeStr]) {
		return table[typeStr];
	}

	if (typeStr.match(/^text\//)) {
		return 'text';
	}
	if (typeStr.match(/^image\//)) {
		return 'img';
	}
	if (typeStr.match(/-audio\//)) {
		return 'audio';
	}
	if (typeStr.match(/^video\//)) {
		return 'video';
	}
	return 'unknown';
}
