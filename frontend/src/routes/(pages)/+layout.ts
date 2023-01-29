import { strapiUrl } from '$lib/utils';
import type { IBreadcrumbItemParam } from '$models/interfaces';
import type { LayoutLoad } from './$types';

export const load = (async ({ url, fetch }) => {
	const paths = url.pathname.split('/');
	let breadcrumbParams: IBreadcrumbItemParam[] = [];
	let joinedPath = '';
	for (const path of paths) {
		if (joinedPath == '') {
			joinedPath = '/';
			breadcrumbParams = [{ href: '/', name: 'Home' }];
		} else {
			const href = joinedPath == '/' ? joinedPath + path : joinedPath + '/' + path;
			let res = await fetch(strapiUrl(`pages?filters[url][$eq]=${href}`));
			if (res.ok) {
				let json = await res.json();
				let data = json.data[0];
				if (!data) {
					res = await fetch(strapiUrl(href.slice(1)));
					if (res.ok) {
						json = await res.json();
						data = json.data;
					}
				}
				const name = data?.attributes?.title || 'Not Found';
				breadcrumbParams = [...breadcrumbParams, { href, name }];
				joinedPath = href;
			}
		}
	}
	return {
		breadcrumbParams
	};
}) satisfies LayoutLoad;
