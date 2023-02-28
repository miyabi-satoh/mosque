<script lang="ts">
	import { page } from '$app/stores';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	console.log(`frontend/src/routes/(pages)/+layout.svelte`);
</script>

<svelte:head>
	{#if $page.data.pageMeta?.title}
		<title>MOSQUE | {$page.data.pageMeta.title}</title>
	{/if}
</svelte:head>

<Breadcrumb params={$page.data.breadcrumbParams} />
{#if $page.data.pageMeta?.title}
	<h1 class="mt-0 mb-2">{$page.data.pageMeta.title}</h1>
{/if}
{#if $page.data.pageMeta?.description}
	<div>{$page.data.pageMeta.description}</div>
{/if}
<div class="pt-8">
	<slot />
</div>
