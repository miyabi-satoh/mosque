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

	export let data: PageData;
	let searchTerm = '';

	$: filterdItems = getFilterdItems(searchTerm);
	function getFilterdItems(term: string) {
		if (term.length > 0) {
			return data.infos.filter(
				(info) => info.attributes.text.includes(term) || info.attributes.title.includes(term)
			);
		}
		return data.infos;
	}
</script>

<div class="w-full">
	{#if data.infos.length > 0}
		<TableSearch
			striped={true}
			placeholder="Search keywords..."
			bind:inputValue={searchTerm}
			divClass="relative overflow-x-auto"
		>
			<TableHead
				class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
			>
				<TableHeadCell>Date</TableHeadCell>
				<TableHeadCell>Title</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each filterdItems as info (info.id)}
					<TableBodyRow>
						<TableBodyCell tdClass="px-6 py-4 lg:whitespace-nowrap"
							>{info.attributes.updatedAt}</TableBodyCell
						><TableBodyCell>
							<A target="_blank" href="./{info?.id}">
								{info.attributes.title}
							</A></TableBodyCell
						>
					</TableBodyRow>
				{/each}
			</TableBody>
		</TableSearch>
	{:else}
		<P class="w-full">データがありません</P>
	{/if}
</div>
