export type Fetch = typeof fetch;

export function apiUrl(url: string) {
	return `http://localhost/api/v1/${url}`;
}

export function strapiUrl(url: string) {
	return `http://localhost/strapi/${url}`;
}
