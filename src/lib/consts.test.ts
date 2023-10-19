import { describe, expect, it } from 'vitest';

import { URLS } from './consts';

describe('URLSのテスト', () => {
	it('URLS.PROFILE', () => {
		expect(URLS.PROFILE()).toBe('/profile');
		expect(URLS.PROFILE('id')).toBe('/profile/id');
	});

	it('URLS.ADMIN_ARCHIVE', () => {
		expect(URLS.ADMIN_ARCHIVE('id')).toBe('/admin/id');
	});

	it('URLS.ADMIN_LINKS', () => {
		expect(URLS.ADMIN_LINKS()).toBe('/admin/links');
		expect(URLS.ADMIN_LINKS('id')).toBe('/admin/links/id');
	});

	it('URLS.BOARD', () => {
		expect(URLS.BOARD()).toBe('/board');
		expect(URLS.BOARD('id')).toBe('/board/id');
	});

	it('URLS.API_CHANNEL', () => {
		expect(URLS.API_CHANNEL('id')).toBe('/api/channel/id');
	});

	it('URLS.API_DATA', () => {
		expect(URLS.API_DATA('exam', 'id')).toBe('/api/data/exam/id');
	});

	it('URLS.API_FETCH', () => {
		expect(URLS.API_FETCH('id')).toBe('/api/fetch?url=id');
	});
});
