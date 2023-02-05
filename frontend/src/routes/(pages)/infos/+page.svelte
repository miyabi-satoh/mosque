<script lang="ts">
	import { Card, Heading, P } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { formatDate } from '$lib/utils';

	export let data: PageData;
	let infos = data.infos;
	let searchTerm = '';

	$: filterdItems = getFilterdItems(searchTerm) || [];
	function getFilterdItems(term: string) {
		if (term.length == 0) {
			return infos.data;
		}
		return infos.data?.filter(
			(info) => info.attributes?.text?.includes(term) || info.attributes?.title?.includes(term)
		);
	}
</script>

<div class="w-full">
	{#if infos.data?.length && infos.data.length > 0}
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
			{#each filterdItems as item (item.id)}
				<Card href="/infos/{item.id}">
					<P size="sm" color="text-gray-500 dark:text-gray-400"
						>{formatDate(item.attributes.updatedAt)}</P
					>
					<Heading tag="h3" customSize="text-2xl font-bold" class="mb-2"
						>{item.attributes?.title}</Heading
					>
					<div class="h-12 line-clamp-2">
						{item.attributes?.text}
					</div>
				</Card>
			{/each}
		</div>
	{:else}
		<P class="w-full">データがありません</P>
	{/if}
</div>
