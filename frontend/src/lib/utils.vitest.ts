import { it, expect, describe } from 'vitest';
import { formatDate, normalizeSearch } from './utils';

describe('formatDateのテスト', () => {
	it('date == null => 空文字列', () => {
		const result = formatDate(null);
		expect(result).toBe('');
	});

	it('date == "2023-02-22" => 2023年2月22日(水)', () => {
		const result = formatDate('2023-02-22');
		expect(result).toBe('2023年2月22日(水)');
	});

	it('date == Date(2023-02-22) => 2023年2月22日(水)', () => {
		const result = formatDate(new Date('2023-02-22'));
		expect(result).toBe('2023年2月22日(水)');
	});
});

describe('utilsのテスト', () => {
	it('normalizeSearchのテスト', () => {
		let result = normalizeSearch('１２３４');
		expect(result).toBe('1234');

		result = normalizeSearch('ａｂｃｄ');
		expect(result).toBe('abcd');

		result = normalizeSearch('テスト');
		expect(result).toBe('てすと');

		result = normalizeSearch('ﾃｽﾄ');
		expect(result).toBe('てすと');
	});
});
