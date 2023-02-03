<script lang="ts">
	import { Heading, P } from 'flowbite-svelte';
	import type { LayoutData } from './$types';
	import Breadcrumb from '$lib/Breadcrumb.svelte';

	export let data: LayoutData;
	$: pageMeta = data.pageMeta;
</script>

<div class="max-w-3xl 2xl:max-w-4xl mx-auto mt-8">
	<div class="container flex flex-wrap mx-auto">
		<Breadcrumb params={data.breadcrumbParams} navClass="flex pt-16 py-8" />
		{#if pageMeta?.title}
			<Heading tag="h1" customSize="text-3xl" class="w-full mb-2">{pageMeta.title}</Heading>
		{/if}
		{#if pageMeta?.description}
			<P class="w-full mb-8">{pageMeta.description}</P>
		{/if}
		<slot />
	</div>
</div>
