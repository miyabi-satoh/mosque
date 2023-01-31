import { dev } from '$app/environment';

export function getLocalToken() {
	return localStorage.getItem('token');
}

export function saveLocalToken(token: string) {
	return localStorage.setItem('token', token);
}

export function removeLocalToken() {
	return localStorage.removeItem('token');
}

export function apiUrl(url: string) {
	return `/api/v1/${wrapDev(url)}`;
}

export function strapiUrl(url: string) {
	return `/strapi/${wrapDev(url)}`;
}

function wrapDev(url: string) {
	if (dev) {
		const dt = new Date();
		if (url.includes('?')) {
			return `${url}&dev=${dt.toJSON()}`;
		}
		return `${url}?dev=${dt.toJSON()}`;
	}
	return url;
}
