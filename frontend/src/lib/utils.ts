export function getLocalToken() {
	return localStorage.getItem('token');
}

export function saveLocalToken(token: string) {
	return localStorage.setItem('token', token);
}

export function removeLocalToken() {
	return localStorage.removeItem('token');
}

export function formatDate(dateStr: string) {
	const dayOfWeeks = '日月火水木金土'.split('');
	const dt = new Date(dateStr);
	return `${dt.getFullYear()}年${dt.getMonth()}月${dt.getDate()}日(${dayOfWeeks[dt.getDay()]})`;
}

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
