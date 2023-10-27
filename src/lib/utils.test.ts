import { addDays } from 'date-fns';

import { convertFullWidthNumbersToHalf, formatDate } from './utils';

describe('convertFullWidthNumbersToHalf', () => {
	it('０１２３４５６７８９ -> 0123456789', () => {
		const ret = convertFullWidthNumbersToHalf('０１２３４５６７８９');
		expect(ret).toBe('0123456789');
	});
	it('abc123あいうａｂｃＡＢＣ -> No effects', () => {
		const ret = convertFullWidthNumbersToHalf('abc123あいうａｂｃＡＢＣ');
		expect(ret).toBe('abc123あいうａｂｃＡＢＣ');
	});
});

describe('formatDate', () => {
	it('-6', () => {
		const now = new Date();
		const d = addDays(now, -6);
		const ret = formatDate(d);
		expect(ret.match('の')).toBeTruthy();
	});
	it('-10', () => {
		const now = new Date();
		const d = addDays(now, -10);
		const ret = formatDate(d);
		expect(ret.match(/^\d\d\//)).toBeTruthy();
	});
	it('-400', () => {
		const now = new Date();
		const d = addDays(now, -400);
		const ret = formatDate(d);
		expect(ret.match(/^\d{4}\//)).toBeTruthy();
	});
});
