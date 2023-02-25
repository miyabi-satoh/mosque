import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import type { BreadcrumbParamType } from '$lib/types';

export const load = (async ({ url }) => {
	// console.log('load @ frontend/src/routes/(pages)/+layout.ts');
	const paths = url.pathname.split('/');
	let breadcrumbParams: BreadcrumbParamType[] = [];
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
