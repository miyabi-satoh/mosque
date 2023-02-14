<script lang="ts">
	import type { LayoutData } from './$types';
	import Breadcrumb from '$lib/Breadcrumb.svelte';

	export let data: LayoutData;
	$: pageMeta = data.pageMeta;
</script>

<div class="max-w-3xl 2xl:max-w-4xl mx-auto mt-8">
	<div class="container flex flex-wrap mx-auto">
		<Breadcrumb params={data.breadcrumbParams} navClass="flex pt-16 py-8" />
		{#if pageMeta.title}
			<h1>{pageMeta.title}</h1>
		{/if}
		{#if pageMeta.description}
			<div>{pageMeta.description}</div>
		{/if}
		<slot />
	</div>
</div>
