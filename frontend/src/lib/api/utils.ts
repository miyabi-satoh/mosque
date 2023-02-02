export type Fetch = typeof fetch;

export function apiUrl(url: string) {
	return `/api/v1/${url}`;
}

export function strapiUrl(url: string) {
	return `/strapi/${url}`;
}
