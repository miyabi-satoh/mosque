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
	let searchTerm = '';

	$: filterdItems = getFilterdItems(searchTerm);
	function getFilterdItems(term: string) {
		if (term.length == 0) {
			return data.formats;
		}
		return data.formats.filter(
			(format) =>
				format.attributes.title.includes(term) || format.attributes.description.includes(term)
		);
	}
</script>

<div class="w-full">
	{#if data.formats.length > 0}
		<TableSearch
			striped={true}
			placeholder="Search keywords..."
			hoverable={true}
			bind:inputValue={searchTerm}
			divClass="relative overflow-x-auto"
		>
			<TableHead>
				<TableHeadCell>Title</TableHeadCell>
				<TableHeadCell>Description</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each filterdItems as format}
					<TableBodyRow>
						<TableBodyCell
							><A href="{$page.url.pathname}/{format.id}">{format.attributes.title}</A
							></TableBodyCell
						>
						<TableBodyCell tdClass="px-6 py-4 lg:whitespace-nowrap"
							>{format.attributes.description}</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			</TableBody>
		</TableSearch>
	{:else}
		<P class="w-full">データがありません</P>
	{/if}
</div>
