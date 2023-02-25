// import { format } from 'date-fns';
// import { ja } from 'date-fns/locale/index.js';

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
	// return format(dt, 'y年M月d日(E)', { locale: ja });
	return `${y}年${m}月${d}日(${w})`;
}

export const normalizeNumber = (numStr: string | null, numDefault = 0) => {
	const num = Number(numStr ?? numDefault);
	return isNaN(num) ? 1 : Math.max(numDefault, num);
};

export function normalizeSearch(search: string): string {
	const hankakuToZenkakuKatakanaMap: Record<string, string> = {
		ｧ: 'ァ',
		ｨ: 'ィ',
		ｩ: 'ゥ',
		ｪ: 'ェ',
		ｫ: 'ォ',
		ｱ: 'ア',
		ｲ: 'イ',
		ｳ: 'ウ',
		ｴ: 'エ',
		ｵ: 'オ',
		ｶ: 'カ',
		ｷ: 'キ',
		ｸ: 'ク',
		ｹ: 'ケ',
		ｺ: 'コ',
		ｶﾞ: 'ガ',
		ｷﾞ: 'ギ',
		ｸﾞ: 'グ',
		ｹﾞ: 'ゲ',
		ｺﾞ: 'ゴ',
		ｻ: 'サ',
		ｼ: 'シ',
		ｽ: 'ス',
		ｾ: 'セ',
		ｿ: 'ソ',
		ｻﾞ: 'ザ',
		ｼﾞ: 'ジ',
		ｽﾞ: 'ズ',
		ｾﾞ: 'ゼ',
		ｿﾞ: 'ゾ',
		ｯ: 'ッ',
		ﾀ: 'タ',
		ﾁ: 'チ',
		ﾂ: 'ツ',
		ﾃ: 'テ',
		ﾄ: 'ト',
		ﾀﾞ: 'ダ',
		ﾁﾞ: 'ヂ',
		ﾂﾞ: 'ヅ',
		ﾃﾞ: 'デ',
		ﾄﾞ: 'ド',
		ﾅ: 'ナ',
		ﾆ: 'ニ',
		ﾇ: 'ヌ',
		ﾈ: 'ネ',
		ﾉ: 'ノ',
		ﾊ: 'ハ',
		ﾋ: 'ヒ',
		ﾌ: 'フ',
		ﾍ: 'ヘ',
		ﾎ: 'ホ',
		ﾊﾞ: 'バ',
		ﾋﾞ: 'ビ',
		ﾌﾞ: 'ブ',
		ﾍﾞ: 'ベ',
		ﾎﾞ: 'ボ',
		ﾊﾟ: 'パ',
		ﾋﾟ: 'ピ',
		ﾌﾟ: 'プ',
		ﾍﾟ: 'ペ',
		ﾎﾟ: 'ポ',
		ﾏ: 'マ',
		ﾐ: 'ミ',
		ﾑ: 'ム',
		ﾒ: 'メ',
		ﾓ: 'モ',
		ｬ: 'ャ',
		ｭ: 'ュ',
		ｮ: 'ョ',
		ﾔ: 'ヤ',
		ﾕ: 'ユ',
		ﾖ: 'ヨ',
		ﾗ: 'ラ',
		ﾘ: 'リ',
		ﾙ: 'ル',
		ﾚ: 'レ',
		ﾛ: 'ロ',
		ﾜ: 'ワ',
		ｦ: 'ヲ',
		ﾝ: 'ン',
		ｳﾞ: 'ヴ',
		ﾜﾞ: 'ヷ',
		ｦﾞ: 'ヺ',
		'｡': '。',
		'｢': '「',
		'｣': '」',
		'､': '、',
		'･': '・'
	};

	const hankakuKatakanaRegex = new RegExp(
		'(' + Object.keys(hankakuToZenkakuKatakanaMap).join('|') + ')',
		'g'
	);

	return (
		search
			// 半角カタカナを全角カタカナに
			.replace(hankakuKatakanaRegex, (x) => hankakuToZenkakuKatakanaMap[x])
			// 全角カタカナを全角ひらがなに
			.replace(/[\u30A1-\u30FA]/g, (x) => String.fromCharCode(x.charCodeAt(0) - 0x60))
			// 全角英数を半角に
			.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (x) => String.fromCharCode(x.charCodeAt(0) - 0xfee0))
			// 全角スペースを半角に
			.replaceAll('　', ' ')
			// 記号を半角スペースに
			.replaceAll(/[!"#$%&'()*,\-./:;<>?@[\\\]^_`{|}~]/g, ' ')
			// 連続する半角スペースを一つの半角スペースに
			.replaceAll(/ +/g, ' ')
			// トリム
			.trim()
	);
}
