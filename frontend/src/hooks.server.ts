import { dev } from '$app/environment';
import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch = (async ({ request, fetch }) => {
	if (dev) {
		const dt = new Date();
		console.log(`${dt.toJSON()}\t${request.url}`);

		const sep = request.url.includes('?') ? '&' : '?';
		request = new Request(`${request.url}${sep}dev=${dt.toJSON()}`, request);
		const res = await fetch(request);
		const json = await res.json();
		if (!res.ok) {
			console.log(`Response is not OK: ${request.url}`);
			console.log(json);
		} else if (json.error) {
			console.log(`Response has error field: ${request.url}`);
			console.log(json);
		}
	}
	return fetch(request);
}) satisfies HandleFetch;
