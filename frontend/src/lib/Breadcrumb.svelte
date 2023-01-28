<script lang="ts" context="module">
	import type { LayoutLoadEvent } from '../routes/(pages)/$types';
	import { strapiUrl } from './utils';

	export interface IBreadcrumbItemParam {
		url: string;
		name: string;
	}

	type fetchType = LayoutLoadEvent['fetch'];

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
				if (json.data[0]) {
					param.name = json.data[0].attributes?.title;
				} else {
					res = await fetch(strapiUrl(param.url.slice(1)));
					json = await res.json();
					if (json.data && json.data.attributes?.title) {
						param.name = json.data.attributes.title;
					} else {
						// console.log(json);
					}
				}
			}

			joinedPath = param.url;
			params = [...params, param];
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
