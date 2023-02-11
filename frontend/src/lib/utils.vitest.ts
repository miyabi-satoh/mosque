import { it, expect, describe } from 'vitest';
import { formatDate, normalizeSearch } from './utils';

describe('utilsのテスト', () => {
	it('formatDateのテスト', () => {
		const result = formatDate('2023-02-12');

		expect(result).toBe('2023年2月12日(日)');
	});

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
