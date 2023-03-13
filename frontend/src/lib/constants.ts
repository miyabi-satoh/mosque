export const COOKIE_SESSION = 'session';
export const ID_MODALS = 'modals';
export const MIME_JSON = 'application/json';

export const URL_ADMIN_USERS = `/admin/users`;
export const URL_ADMIN_USERS_CREATE = `${URL_ADMIN_USERS}/create`;
export const URL_ADMIN_RESOURCES = `/admin/resources`;
export const URL_ADMIN_RESOURCES_CREATE = `${URL_ADMIN_RESOURCES}/create`;
export const URL_ADMIN_DBMAINTE = '/admin/dbmainte/';
export const URL_EDIT = (base: string, id: number | undefined) => `${base}/${id}/edit`;
export const URL_DELETE = (base: string, id: number | undefined) => `${base}/${id}/delete`;

export const API = {
	ASSET: `/api/asset`,
	LINK_CLICK: (id: number) => `/api/link/${id}/click`,
	LOGIN: `/api/auth/login`,
	LOGOUT: `/api/auth/logout`,
	RESOURCE_CLICK: (id: number) => `/api/resource/${id}/click`,
	USER: `/api/user`
} as const;

export const MSG = {
	UKNOWN_ERROR: `不明なエラーです。`,
	TARGET_NOT_FOUND: `対象のデータが見つかりませんでした。`,
	SAVE_OK: (text = '') => `${text ? '"' + text + '"を' : ''}保存しました。`
} as const;

export const hankakuToZenkakuKatakanaMap: Record<string, string> = {
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
} as const;
