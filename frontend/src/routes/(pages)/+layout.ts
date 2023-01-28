import { createBreadcrumbParams } from '$lib/Breadcrumb.svelte';
import type { LayoutLoad } from './$types';

export const load = (async ({ url, fetch }) => {
	const breadcrumbParams = await createBreadcrumbParams(fetch, url.pathname);

	return {
		breadcrumbParams
	};
}) satisfies LayoutLoad;
