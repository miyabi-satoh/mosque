<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Card, Heading, P, Span } from 'flowbite-svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import type { PageData } from './$types';

	export let data: PageData;
	$: pageMeta = data.pageMeta;
	$: menuItems = data.menuItems;
</script>

<div
	class="relative bg-white overflow-hidden mt-24 lg:mb-8 mx-auto dark:bg-gray-900 2xl:px-8 text-center lg:text-left"
>
	<Heading tag="h1" customSize="text-4xl font-extrabold">{pageMeta.title}</Heading>
	{#if pageMeta.description}
		<P class="w-full my-8">{pageMeta.description}</P>
	{/if}
</div>
<div class="my-8 rounded-xl border border-gray-200 dark:border-gray-700 p-2 sm:p-6">
	<Heading tag="h2" class="text-center" customSize="text-xl font-bold"
		>{info.attributes.title}</Heading
	>
	<P color="text-gray-500 dark:text-gray-400" align="right" size="sm"
		>最終更新日：{info.attributes.updatedAt.slice(0, 10)}</P
	>
	<div class="markdown mt-2">
		<SvelteMarkdown source={info.attributes.text} />
	</div>
</div>
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
	{#each menuItems as menuItem (menuItem.id)}
		<Card padding="none" href={menuItem.attributes.url} size="xl">
			<P
				class="rounded-t-md py-2.5 px-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-600"
			>
				<Heading tag="h5" class="text-gray-500 dark:text-white">{menuItem.attributes.title}</Heading
				>
				<Span><Icon icon="mdi:external-link" height="auto" /></Span>
			</P>
			<P class="m-4">
				{menuItem.attributes.description}
			</P>
		</Card>
	{/each}
</div>
