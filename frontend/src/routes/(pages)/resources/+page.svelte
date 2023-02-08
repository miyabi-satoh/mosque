<script lang="ts">
	import {
		A,
		P,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch
	} from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;
	$: resourcesData = data.resources.data;
	$: resourcesMeta = data.resources.meta;

	let searchTerm = '';

	$: filterdItems = getFilterdItems(searchTerm);
	function getFilterdItems(term: string) {
		if (term.length == 0) {
			return resourcesData;
		}
		return resourcesData.filter((resource) => resource.attributes.keywords.includes(term));
	}
</script>

<div class="w-full">
	{#if resourcesMeta.pagination.total > 0}
		<TableSearch
			striped={true}
			placeholder="Search keywords..."
			hoverable={true}
			bind:inputValue={searchTerm}
			divClass="relative overflow-x-auto"
		>
			<TableHead>
				<TableHeadCell>Title</TableHeadCell>
				<TableHeadCell>Items</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each filterdItems as resource (resource.id)}
					<TableBodyRow>
						<TableBodyCell
							><A href="{$page.url.pathname}/{resource.id}">{resource.attributes.title}</A
							></TableBodyCell
						>
						<TableBodyCell tdClass="px-6 py-4 lg:whitespace-nowrap"
							>{resource.attributes.assets.data.length}</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			</TableBody>
		</TableSearch>
	{:else}
		<P class="w-full">データがありません</P>
	{/if}
</div>
