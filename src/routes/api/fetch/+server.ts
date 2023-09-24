import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const urlStr = url.searchParams.get('url')?.toString();
	if (urlStr) {
		try {
			const res = await fetch(urlStr);
			if (res.ok) {
				// const html = await res.text();
				return new Response(await res.text());
			}
		} catch (e) {
			console.log(e);
		}
	}
	return new Response();
};
