<script lang="ts">
	import Icon from '@iconify/svelte';
	import {
		A,
		ChevronLeft,
		ChevronRight,
		Input,
		P,
		Pagination,
		Search,
		Select,
		Span,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { formatDate } from '$lib/utils';

	export let data: PageData;

	let stateSearchTerm = $page.url.searchParams.get('q') ?? '';
	$: stateCurrentPageNumber = Number($page.url.searchParams.get('p')) ?? 1;
	$: stateStartDate = Number($page.url.searchParams.get('s')) ?? 1;
	$: stateEndDate = Number($page.url.searchParams.get('e')) ?? 1;
	$: stateSchedules = data.schedules.stateSchedules;
	$: statePageCount = data.schedules.stateMeta?.pagination?.pageCount ?? 0;
	$: statePages = data.schedules.statePages;

	async function movePage(page: number) {
		if (page < 1) {
			page = 1;
		} else if (statePageCount < page) {
			page = statePageCount;
		}
		stateCurrentPageNumber = page;
		const href = `/schedules?p=${page}&q=${stateSearchTerm}`;
		await goto(href, {
			keepFocus: true
		});
	}

	let mounted = false;
	onMount(() => (mounted = true));
	$: if (mounted) {
		stateSearchTerm;
		movePage(1);
	}
</script>

<div class="w-full">
	<div class="py-4 flex flex-col md:flex-row gap-2">
		<Search
			size="md"
			class="flex flex-1 gap-2 items-center"
			placeholder="Search keywords..."
			bind:value={stateSearchTerm}
		/>
		<div class="flex items-center gap-2">
			<Input type="date" />〜<Input type="date" />
		</div>
	</div>
	{#if stateSchedules && stateSchedules.length > 0}
		<Table striped={true} divClass="relative overflow-x-auto">
			<TableHead
				class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
			>
				<TableHeadCell>Date</TableHeadCell>
				<TableHeadCell>Events</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each stateSchedules as schedule (schedule.id)}
					<TableBodyRow>
						<TableBodyCell>
							{formatDate(schedule.attributes.date)}
						</TableBodyCell>
						<TableBodyCell tdClass="px-6 py-4">{console.log(schedule.attributes)}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>

		{#if statePageCount > 1}
			<div class="flex justify-center mt-4">
				<Pagination
					bind:pages={statePages}
					on:previous={() => movePage(stateCurrentPageNumber - 1)}
					on:next={() => movePage(stateCurrentPageNumber + 1)}
					icon
				>
					<svelte:fragment slot="prev">
						<span class="sr-only">Previous</span>
						<ChevronLeft class="w-5 h-5" />
					</svelte:fragment>
					<svelte:fragment slot="next">
						<span class="sr-only">Next</span>
						<ChevronRight class="w-5 h-5" />
					</svelte:fragment>
				</Pagination>
			</div>
		{/if}
	{:else}
		<P class="w-full">データがありません</P>
	{/if}
</div>
