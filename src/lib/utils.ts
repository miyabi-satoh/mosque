import { format, formatRelative } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { User } from 'lucia';

// https://note.affi-sapo-sv.com/js-convert-full-width-numbers.php
export const convertFullWidthNumbersToHalf = (() => {
	// Calculate the difference between full-width and half-width numbers
	const diff = '０'.charCodeAt(0) - '0'.charCodeAt(0);

	// return the function
	return (text: string): string =>
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

export function hasAdminRole(user: User | null | undefined): boolean {
	return user?.role === 'ADMIN';
}

export function hasStaffRole(user: User | null | undefined): boolean {
	return user?.role === 'STAFF' || user?.role === 'ADMIN';
}

export function isWindows(ua: string | null): boolean {
	if (ua) {
		return ua.includes('Windows NT');
	}
	return true;
}

export function formatDate(date: Date): string {
	const now = new Date();
	const s = formatRelative(date, now, { locale: ja });
	if (!s.includes('/')) return s;

	if (date.getFullYear() === now.getFullYear())
		return format(date, 'MM/dd(E) H:mm', { locale: ja });

	return format(date, 'yyyy/MM/dd(E) H:mm', { locale: ja });
}
