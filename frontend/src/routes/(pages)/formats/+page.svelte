<script lang="ts">
	import { page } from '$app/stores';
	import type { IFormat } from '$models/interfaces';
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

	let searchTerm = '';
	$: data = $page.data;

	$: filterdItems =
		searchTerm.length > 0
			? data.formats.filter(
					(format: IFormat) =>
						format?.title?.includes(searchTerm) || format?.description?.includes(searchTerm)
			  )
			: data.formats;
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
							><A href="{$page.url.pathname}/{format?.id}">{format?.title}</A></TableBodyCell
						>
						<TableBodyCell tdClass="px-6 py-4 lg:whitespace-nowrap"
							>{format?.description}</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			</TableBody>
		</TableSearch>
	{:else}
		<P class="w-full">データがありません</P>
	{/if}
</div>
