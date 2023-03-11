import { ValidationError } from 'yup';
import { hankakuToZenkakuKatakanaMap } from './constants';

// https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
// Exclude keys from object
export const exclude = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
	for (const key of keys) {
		delete obj[key];
	}
	return obj;
};

// https://dev.to/danawoodman/getting-form-body-data-in-your-sveltekit-endpoints-4a85
type StructuredFormData = string | boolean | number | File | StructuredFormData[];

export const fromRequest = async <T>(request: Request) => {
	const values = await request.formData();
	return [...values.entries()].reduce((data, [k, v]) => {
		let value: StructuredFormData = v;
		if (v === 'true' || v === 'on') value = true;
		if (v === 'false' || v === 'off') value = false;
		if (v !== '' && !isNaN(Number(v))) value = Number(v);

		// For grouped fields like multi-selects and checkboxes, we need to
		// store the values in an array.
		if (k in data) {
			const val = data[k];
			value = Array.isArray(val) ? [...val, value] : [val, value];
		}

		data[k] = value;

		return data;
	}, {} as Record<string, StructuredFormData>) as T;
};

export const fromValidationError = (error: unknown) => {
	if (error instanceof ValidationError) {
		return error.inner.reduce((acc, err) => {
			return { ...acc, [err.path ?? 'error']: err.message };
		}, {});
	}
	console.log(error);
	return { error: 'Unknown error.' };
};

export function formatDate(date: string | Date | null) {
	if (date === null) {
		return '';
	}

	let dt: Date;
	if (typeof date === 'string') {
		dt = new Date(date);
	} else {
		dt = date;
	}

	const y = dt.getFullYear();
	const m = dt.getMonth() + 1;
	const d = dt.getDate();
	const w = ['日', '月', '火', '水', '木', '金', '土'][dt.getDay()];
	return `${y}年${m}月${d}日(${w})`;
}

// 文字列を数値に変換
export const normalizeNumber = (numStr: string | null, numDefault = 0) => {
	const num = Number(numStr ?? numDefault);
	return isNaN(num) ? numDefault : num;
};

// 半角カタカナ・全角ひらがなを全角カタカナに
export const convertToKatakana = (s: string) => {
	const hankakuKatakanaRegex = new RegExp(
		'(' + Object.keys(hankakuToZenkakuKatakanaMap).join('|') + ')',
		'g'
	);

	return s
		.replace(hankakuKatakanaRegex, (x) => hankakuToZenkakuKatakanaMap[x])
		.replace(/[\u3041-\u3096]/g, (x) => String.fromCharCode(x.charCodeAt(0) + 0x60));
};

// 全角英数記号・スペースを半角に
export const zenkakuToHankaku = (s: string) => {
	const regex = /[Ａ-Ｚａ-ｚ０-９！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝]/g;

	// 入力値の全角を半角の文字に置換
	return s
		.replace(regex, (x) => String.fromCharCode(x.charCodeAt(0) - 0xfee0))
		.replace(/[‐－―]/g, '-') // ハイフンなど
		.replace(/[～〜]/g, '~') // チルダ
		.replace(/[\u3000]/g, ' '); // スペース
};

export const normalizeSearch = (search: string) => {
	// かなを全角カタカナに統一
	search = convertToKatakana(search);
	// 全角英数・スペースを半角に統一
	search = zenkakuToHankaku(search);

	return (
		search
			// 連続する半角スペースを一つの半角スペースに
			.replaceAll(/ +/g, ' ')
			// トリム
			.trim()
	);
};
