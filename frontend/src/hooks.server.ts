import type { HandleFetch } from '@sveltejs/kit';
import { PUBLIC_SERVER_NAME } from '$env/static/public';

export const handleFetch = (async ({ request, fetch }) => {
	if (request.url.startsWith(`http://${PUBLIC_SERVER_NAME}`)) {
		const newUrl = request.url.replace(`http://${PUBLIC_SERVER_NAME}`, 'http://127.0.0.1');
		console.log(request.url);
		console.log(` -> ${newUrl}`);
		// clone the original request, but change the URL
		request = new Request(newUrl, request);
	}

	return fetch(request);
}) satisfies HandleFetch;
