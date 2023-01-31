<script lang="ts">
	// import { page } from '$app/stores';
	import { Heading, P } from 'flowbite-svelte';
	import Breadcrumb from '$lib/Breadcrumb.svelte';
	import type { LayoutData } from './$types';

	// $: data = $page.data;
	export let data: LayoutData;
</script>

<div class="max-w-3xl 2xl:max-w-4xl mx-auto mt-8">
	<div class="container flex flex-wrap mx-auto">
		<Breadcrumb params={data.breadcrumbParams} navClass="flex pt-16 py-8" />
		{#if data.pageInfo.title}
			<Heading tag="h1" customSize="text-3xl" class="w-full mb-2">{data.pageInfo.title}</Heading>
			<P class="w-full mb-8">{data.pageInfo.description}</P>
		{/if}
		<slot />
	</div>
</div>
