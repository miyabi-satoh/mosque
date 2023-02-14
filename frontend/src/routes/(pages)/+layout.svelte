<script lang="ts">
	import type { LayoutData } from './$types';
	import Breadcrumb from '$lib/Breadcrumb.svelte';

	export let data: LayoutData;
	$: pageMeta = data.pageMeta;
</script>

<!-- <div class="max-w-3xl 2xl:max-w-4xl mx-auto mt-8">
	<div class="container mx-auto"> -->
<Breadcrumb params={data.breadcrumbParams} />
{#if pageMeta.title}
	<h1 class="mt-0 mb-2">{pageMeta.title}</h1>
{/if}
{#if pageMeta.description}
	<div>{pageMeta.description}</div>
{/if}
<div class="pt-8">
	<slot />
</div>
<!-- </div>
</div> -->
