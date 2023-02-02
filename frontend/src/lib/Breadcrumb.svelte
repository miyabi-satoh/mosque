<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import type { IBreadcrumbItemParam } from '$models/interfaces';

	export let navClass = 'flex';
	export let params: IBreadcrumbItemParam[];
</script>

<Breadcrumb {navClass}>
	{#each params as param, index}
		<BreadcrumbItem
			home={param.href == '/'}
			href={index == params.length - 1 ? undefined : param.href}>{param.name}</BreadcrumbItem
		>
	{/each}
</Breadcrumb>
