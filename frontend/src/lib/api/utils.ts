import { PUBLIC_SERVER_HOST } from '$env/static/public';

export function apiUrl(url: string) {
	return `${PUBLIC_SERVER_HOST}/api/v1/${url}`;
}

export function strapiUrl(url: string) {
	return `${PUBLIC_SERVER_HOST}/strapi/${url}`;
}
