import { PUBLIC_BACKEND_HOST, PUBLIC_STRAPI_HOST } from '$env/static/public';

export function apiUrl(url: string) {
	return `${PUBLIC_BACKEND_HOST}/api/v1/${url}`;
}

export function strapiUrl(url: string) {
	return `${PUBLIC_STRAPI_HOST}/api/${url}`;
}
