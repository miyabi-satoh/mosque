import type { LayoutServerLoad } from './$types';
import type { IBreadcrumbItemParam } from '$schemas';
import { prisma } from '$lib/server/prisma';

export const load = (async ({ url }) => {
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
			const page = await prisma.page.findFirst({
				where: { url: href }
			});
			if (page) {
				breadcrumbParams = [
					...breadcrumbParams,
					{
						href,
						name: page.title ?? ''
					}
				];
				joinedPath = href;
			}
		}
	}
	return {
		breadcrumbParams
	};
}) satisfies LayoutServerLoad;
