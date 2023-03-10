import { it, expect, describe } from 'vitest';
import { convertToKatakana, formatDate, normalizeNumber, zenkakuToHankaku } from './utils';

describe('zenkakuToHankakuのテスト', () => {
	it('英数記号', () => {
		const result = zenkakuToHankaku(
			'ＡＺａｚ０９！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝'
		);
		expect(result).toBe('AZaz09!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}');
	});
	it('ハイフン', () => {
		const result = zenkakuToHankaku('‐－―');
		expect(result).toBe('---');
	});
	it('チルダ', () => {
		const result = zenkakuToHankaku('～〜');
		expect(result).toBe('~~');
	});
	it('スペース', () => {
		const result = zenkakuToHankaku('　');
		expect(result).toBe(' ');
	});
});

describe('convertToKatakanaのテスト', () => {
	it('半角カタカナ => 全角カタカナ', () => {
		const result = convertToKatakana('ﾊﾝｶｸ');
		expect(result).toBe('ハンカク');
	});
	it('全角ひらがな => 全角カタカナ', () => {
		const result = convertToKatakana('ひらがな');
		expect(result).toBe('ヒラガナ');
	});
	it('そのまま', () => {
		const result = convertToKatakana('１２３789日曜日Sundayｍａｙ');
		expect(result).toBe('１２３789日曜日Sundayｍａｙ');
	});
});

describe('normalizeNumberのテスト', () => {
	it('numStr == null => 0', () => {
		const result = normalizeNumber(null);
		expect(result).toBe(0);
	});
	it('numStr == null, numDefault = 1 => 1', () => {
		const result = normalizeNumber(null, 1);
		expect(result).toBe(1);
	});
	it('numStr == "1" => 1', () => {
		const result = normalizeNumber('1');
		expect(result).toBe(1);
	});
	it('numStr == "" => 0', () => {
		const result = normalizeNumber('');
		expect(result).toBe(0);
	});
	it('numStr == "a" => 0', () => {
		const result = normalizeNumber('a');
		expect(result).toBe(0);
	});
});

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
