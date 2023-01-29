import type { HandleFetch } from '@sveltejs/kit';

export const handleFetch = (({ request, fetch }) => {
	const dt = new Date();
	console.log(`${dt.toJSON()}\t${request.url}\n`);

	return fetch(request);
}) satisfies HandleFetch;
