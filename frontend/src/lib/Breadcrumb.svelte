<script lang="ts" context="module">
	import { strapiUrl } from './utils';
	import type { IPage } from '$models/interfaces';

	export interface IBreadcrumbItemParam {
		url: string;
		name: string;
	}

	type fetchType = LayoutServerLoadEvent['fetch'];

	export async function createBreadcrumbParams(fetch: fetchType, url: string) {
		const paths = url.split('/');
		let params: IBreadcrumbItemParam[] = [];
		let joinedPath: string | undefined = undefined;
		for (const path of paths) {
			let param: IBreadcrumbItemParam = {
				url: '/',
				name: 'Home'
			};
			if (joinedPath !== undefined) {
				param.url = joinedPath == '/' ? joinedPath + path : joinedPath + '/' + path;
				let res = await fetch(strapiUrl(`pages?filters[url][$eq]=${param.url}`));
				let json = await res.json();
				// console.log(json);
				param.name = (json.data[0] as IPage)?.attributes?.title ?? '';
			}

			joinedPath = param.url;
			params = [...params, param];
		}
		return params;
	}
</script>

<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import type { LoadEvent } from '@sveltejs/kit';
	import type { LayoutServerLoadEvent } from '../routes/$types';

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
