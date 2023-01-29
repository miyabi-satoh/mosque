<script lang="ts" context="module">
	import type { LayoutLoadEvent } from '../routes/(pages)/$types';
	import { strapiUrl } from './utils';

	export interface IBreadcrumbItemParam {
		url: string;
		name: string;
	}

	type fetchType = LayoutLoadEvent['fetch'];

	export async function createBreadcrumbParams(fetch: fetchType, route: string) {
		const paths = route.split('/');
		let params: IBreadcrumbItemParam[] = [];
		let joinedPath: string | undefined = undefined;
		for (const path of paths) {
			if (joinedPath === undefined) {
				joinedPath = '/';
				params = [{ url: '/', name: 'Home' }];
			} else {
				const url: string = joinedPath == '/' ? joinedPath + path : joinedPath + '/' + path;
				let res = await fetch(strapiUrl(`pages?filters[url][$eq]=${url}`));
				let json = await res.json();
				let data = json.data[0];
				if (!data) {
					res = await fetch(strapiUrl(url.slice(1)));
					if (res.ok) {
						json = await res.json();
						data = json.data;
					}
				}
				const name = data?.attributes?.title || 'Not Found';
				params = [...params, { url, name }];
				joinedPath = url;
			}
		}
		return params;
	}
</script>

<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';

	export let navClass = 'flex';
	export let params: IBreadcrumbItemParam[];
</script>

<Breadcrumb {navClass}>
	{#each params as param, index}
		<BreadcrumbItem
			home={param.url == '/'}
			href={index == params.length - 1 ? undefined : param.url}>{param.name}</BreadcrumbItem
		>
	{/each}
</Breadcrumb>
