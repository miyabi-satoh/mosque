import { URLS } from './consts';

describe('URLSのテスト', () => {
	it('URLS.PROFILE', () => {
		expect(URLS.PROFILE()).toBe('/profile');
		expect(URLS.PROFILE('id')).toBe('/profile/id');
	});

	it('URLS.PASSWD', () => {
		expect(URLS.PASSWD()).toBe('/passwd');
		expect(URLS.PASSWD('id')).toBe('/passwd/id');
	});

	it('URLS.ADMIN_ARCHIVES', () => {
		expect(URLS.ADMIN_ARCHIVES()).toBe('/admin/archives');
		expect(URLS.ADMIN_ARCHIVES('id')).toBe('/admin/archives/id');
	});

	it('URLS.ADMIN_ARCHIVE_ITEMS', () => {
		expect(URLS.ADMIN_ARCHIVE_ITEMS('id')).toBe('/admin/archives/id/items');
	});

	it('URLS.ADMIN_LINKS', () => {
		expect(URLS.ADMIN_LINKS()).toBe('/admin/links');
		expect(URLS.ADMIN_LINKS('id')).toBe('/admin/links/id');
	});

	it('URLS.ARCHIVES', () => {
		expect(URLS.ARCHIVES('id')).toBe('/archives/id');
	});

	it('URLS.BOARD', () => {
		expect(URLS.BOARD()).toBe('/board');
		expect(URLS.BOARD('id')).toBe('/board/id');
	});

	it('URLS.API_CHANNEL', () => {
		expect(URLS.API_CHANNEL('id')).toBe('/api/channel/id');
	});

	it('URLS.API_ARCHIVE_ITEM', () => {
		expect(URLS.API_ARCHIVE_ITEM('id')).toBe('/api/archive/item/id');
	});

	it('URLS.API_FETCH', () => {
		expect(URLS.API_FETCH('id')).toBe('/api/fetch?url=id');
	});
});
