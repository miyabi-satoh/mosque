<script lang="ts">
	// import { page } from '$app/stores';
	// import type { ILink } from '$models/interfaces';
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

	// $: data = $page.data;
	export let data: PageData;

	$: filterdItems =
		searchTerm.length > 0
			? data.infos.filter((info) => info?.attributes?.text?.includes(searchTerm))
			: data.infos;
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
				<TableHeadCell>Title</TableHeadCell>
				<TableHeadCell>Description</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each filterdItems as info (info?.id)}
					<TableBodyRow>
						<TableBodyCell>
							<A target="_blank" href="./{info?.id}">
								<span class="mr-2">{info?.attributes?.title}</span>
								<Icon icon="mdi:external-link" height="auto" />
							</A></TableBodyCell
						>
						<TableBodyCell tdClass="px-6 py-4 lg:whitespace-nowrap"
							>{info?.attributes?.updatedAt}</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			</TableBody>
		</TableSearch>
	{:else}
		<P class="w-full">データがありません</P>
	{/if}
</div>
