import type { User } from 'lucia';

// https://note.affi-sapo-sv.com/js-convert-full-width-numbers.php
export const convertFullWidthNumbersToHalf = (() => {
	// Calculate the difference between full-width and half-width numbers
	const diff = '０'.charCodeAt(0) - '0'.charCodeAt(0);

	// return the function
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

export function hasAdminRole(user: User): boolean {
	return user.role === 'ADMIN';
}
export function hasStaffRole(user: User): boolean {
	return user.role === 'STAFF' || user.role === 'ADMIN';
}

const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
export function isMobile(ua: string | null): boolean {
	if (ua) {
		return regex.test(ua);
	}
	return true;
}
