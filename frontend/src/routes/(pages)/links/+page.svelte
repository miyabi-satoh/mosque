<script lang="ts">
	import type { ILink } from '$models/interfaces';
	import Icon from '@iconify/svelte';
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

	let searchTerm = '';
	export let data: PageData;

	$: filterdItems =
		searchTerm.length > 0
			? data.links.filter(
					(link: ILink) =>
						link?.title?.includes(searchTerm) ||
						link?.url?.includes(searchTerm) ||
						link?.description?.includes(searchTerm)
			  )
			: data.links;
</script>

<div class="w-full">
	{#if data.links.length > 0}
		<TableSearch
			striped={true}
			placeholder="Search keywords..."
			bind:inputValue={searchTerm}
			divClass="relative overflow-x-auto"
		>
			<TableHead
				class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
			>
				<TableHeadCell>Title</TableHeadCell>
				<TableHeadCell>Description</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each filterdItems as link (link?.id)}
					<TableBodyRow>
						<TableBodyCell>
							<A target="_blank" href={link?.url}>
								<span class="mr-2">{link?.title}</span>
								<Icon icon="mdi:external-link" height="auto" />
							</A></TableBodyCell
						>
						<TableBodyCell tdClass="px-6 py-4 lg:whitespace-nowrap"
							>{link?.description}</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			</TableBody>
		</TableSearch>
	{:else}
		<P class="w-full">データがありません</P>
	{/if}
</div>
