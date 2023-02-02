import type { LayoutLoad } from './$types';
import { apiPages, strapiUrl } from '$lib/api';
import type { IBreadcrumbItemParam } from '$models/interfaces';

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
			let data = await apiPages.getByPathname(fetch, href);
			if (!data) {
				const res = await fetch(strapiUrl(href.slice(1)));
				if (res.ok) {
					const json = await res.json();
					data = json.data;
				}
			}

			const name = data.attributes.title || 'Not Found';
			breadcrumbParams = [...breadcrumbParams, { href, name }];
			joinedPath = href;
		}
	}
	return {
		breadcrumbParams
	};
}) satisfies LayoutLoad;
