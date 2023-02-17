import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch = (async ({ request, fetch }) => {
	if (request.url.startsWith('http://localhost:')) {
		const newUrl = request.url.replace('http://localhost:', 'http://127.0.0.1:');
		console.log(request.url);
		console.log(` -> ${newUrl}`);
		// clone the original request, but change the URL
		request = new Request(newUrl, request);
	}

	return fetch(request);
}) satisfies HandleFetch;
