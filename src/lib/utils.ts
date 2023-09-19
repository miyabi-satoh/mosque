// https://note.affi-sapo-sv.com/js-convert-full-width-numbers.php
export const convertFullWidthNumbersToHalf = (() => {
	// 全角数字と半角数字の差分を計算
	const diff = '０'.charCodeAt(0) - '0'.charCodeAt(0);

	// 置換関数を返す
	return (text: string) =>
		text.replace(/[０-９]/g, (m) => String.fromCharCode(m.charCodeAt(0) - diff));
})();

// https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
// Exclude keys from object
export function exclude<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
	const objCopy = { ...obj };
	for (const key of keys) {
		delete objCopy[key];
	}
	return objCopy;
}
