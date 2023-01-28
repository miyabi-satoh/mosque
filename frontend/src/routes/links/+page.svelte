<script lang="ts">
	import {
		A,
		P,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TableSearch
	} from 'flowbite-svelte';
	import type { PageServerData } from './$types';

	let searchTerm = '';
	export let data: PageServerData;

	$: filterdItems =
		searchTerm.length > 0
			? data.links.filter(
					(link) =>
						link?.attributes?.title?.includes(searchTerm) ||
						link?.attributes?.url?.includes(searchTerm) ||
						link?.attributes?.description?.includes(searchTerm)
			  )
			: data.links;
</script>

<div class="w-full">
	{#if data.links.length > 0}
		<TableSearch
			striped={true}
			placeholder="Search keywords..."
			hoverable={true}
			bind:inputValue={searchTerm}
		>
			<TableHead>
				<TableHeadCell>Title</TableHeadCell>
				<TableHeadCell>Description</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each filterdItems as link (link?.id)}
					<TableBodyRow>
						<TableBodyCell
							><A target="_blank" href={link?.attributes?.url}>{link?.attributes?.title}</A
							></TableBodyCell
						>
						<TableBodyCell tdClass="px-6 py-4 lg:whitespace-nowrap"
							>{link?.attributes?.description}</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			</TableBody>
		</TableSearch>
	{:else}
		<P class="w-full">データがありません</P>
	{/if}
</div>
