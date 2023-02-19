<script lang="ts">
	import type { LayoutData } from './$types';
	import Breadcrumb from '$lib/Breadcrumb.svelte';
	import { page } from '$app/stores';

	export let data: LayoutData;
	$: pageMeta = $page.data.pageMeta;
</script>

<svelte:head>
	<title>MOSQUE | {pageMeta.title}</title>
</svelte:head>

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
