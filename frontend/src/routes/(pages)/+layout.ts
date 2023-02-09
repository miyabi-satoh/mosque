import type { LayoutLoad } from './$types';
import { apiPages, strapiUrl } from '$lib/api';
import type { IBreadcrumbItemParam } from '$models/interfaces';

export const load = (async ({ url, fetch }) => {
	// console.log('load @ frontend/src/routes/(pages)/+layout.ts');
	const paths = url.pathname.split('/');
	let breadcrumbParams: IBreadcrumbItemParam[] = [];
	let joinedPath = '';
	for (const path of paths) {
		if (joinedPath == '') {
			joinedPath = '/';
			breadcrumbParams = [{ href: '/', name: 'Home' }];
		} else {
			const href = joinedPath == '/' ? joinedPath + path : joinedPath + '/' + path;
			let name = 'Not Found';
			try {
				const pageJson = await apiPages.getByUrl(fetch, href);
				if (pageJson.meta.pagination.total > 0) {
					name = pageJson.data[0].attributes.title;
				} else {
					const res = await fetch(strapiUrl(href.slice(1)));
					if (res.ok) {
						const json = await res.json();
						name = json.data.attributes.title;
					}
				}
				breadcrumbParams = [...breadcrumbParams, { href, name }];
				joinedPath = href;
			} catch (err) {
				// console.log(err);
			}
		}
	}
	return {
		breadcrumbParams
	};
}) satisfies LayoutLoad;
