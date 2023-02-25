<script lang="ts">
	// import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	// export let data: LayoutData;
	// $: pageMeta = $page.data.pageMeta;
</script>

<svelte:head>
	<title>MOSQUE | {$page.data.pageMeta.title}</title>
</svelte:head>

<Breadcrumb params={$page.data.breadcrumbParams} />
{#if $page.data.pageMeta.title}
	<h1 class="mt-0 mb-2">{$page.data.pageMeta.title}</h1>
{/if}
{#if $page.data.pageMeta.description}
	<div>{$page.data.pageMeta.description}</div>
{/if}
<div class="pt-8">
	<slot />
</div>
