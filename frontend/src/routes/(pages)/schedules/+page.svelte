<script lang="ts">
	import {
		Input,
		P,
		Search,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { format, parse } from 'date-fns';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { formatDate } from '$lib/utils';
	import Pagination from '$lib/Pagination.svelte';

	export let data: PageData;
	$: stateSchedules = data.schedules.stateSchedules;
	$: statePageCount = data.schedules.stateMeta?.pagination?.pageCount ?? 0;
	$: statePages = data.schedules.statePages;

	let stateSearchTerm = $page.url.searchParams.get('q') ?? '';
	let stateCurrentPageNumber = Number($page.url.searchParams.get('p')) ?? 1;
	let inputStartDate = dateString($page.url.searchParams.get('s') ?? '', new Date());
	let inputEndDate = dateString($page.url.searchParams.get('e') ?? '');

	$: stateStartDate = dateString(inputStartDate);
	$: stateEndDate = dateString(inputEndDate);

	function dateString(dateStr: string, defaultDate: Date | undefined = undefined): string {
		try {
			return format(new Date(dateStr), 'yyyy-MM-dd');
		} catch (err) {
			if (defaultDate) {
				return format(defaultDate, 'yyyy-MM-dd');
			}
		}
		return '';
	}

	async function movePage(page: number) {
		if (page < 1) {
			page = 1;
		} else if (statePageCount < page) {
			page = statePageCount;
		}
		stateCurrentPageNumber = page;
		const href = `/schedules?p=${page}&q=${stateSearchTerm}&s=${stateStartDate}&e=${stateEndDate}`;
		await goto(href, {
			keepFocus: true
		});
	}

	let mounted = false;
	onMount(() => (mounted = true));
	$: if (mounted) {
		stateSearchTerm;
		stateStartDate;
		stateEndDate;
		// console.log(stateStartDate, stateEndDate);
		movePage(1);
	}

	function formatEvent(name: string, start: string, end: string) {
		let strStart = '';
		if (start) {
			strStart = format(parse(start, 'HH:mm:ss', new Date()), 'H:mm');
		}

		let strEnd = '';
		if (end) {
			strEnd = format(parse(end, 'HH:mm:ss', new Date()), 'H:mm');
		}
		if (start || end) {
			return `${name}(${strStart}〜${strEnd})`;
		}
		return name;
	}

	function splitDate(dateString: string) {
		dateString = formatDate(dateString);
		const s1 = dateString.slice(0, 5);
		const s2 = dateString.slice(5, -3);
		const s3 = dateString.slice(-3);
		return [s1, s2, s3];
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
			<Input type="date" bind:value={inputStartDate} />
			〜
			<Input type="date" bind:value={inputEndDate} />
		</div>
	</div>
	{#if stateSchedules && stateSchedules.length > 0}
		<Table striped={true}>
			<TableHead
				class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
			>
				<TableHeadCell>Date</TableHeadCell>
				<TableHeadCell>Events</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each stateSchedules as schedule (schedule.id)}
					<TableBodyRow>
						<TableBodyCell tdClass="px-4 md:px-6 py-4 whitespace-nowrap">
							{#each splitDate(schedule.attributes.date) as s, index}
								<span class={index == 0 ? 'hidden md:inline' : ''}>{s}</span>
							{/each}
						</TableBodyCell>
						<TableBodyCell tdClass="px-4 md:px-6 py-4">
							{#each schedule.attributes.schedules.data as event (event.id)}
								<p>
									{formatEvent(event.attributes.name, event.attributes.start, event.attributes.end)}
								</p>
							{/each}
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>

		{#if statePageCount > 1}
			<Pagination
				pages={statePages}
				on:previous={() => movePage(stateCurrentPageNumber - 1)}
				on:next={() => movePage(stateCurrentPageNumber + 1)}
			/>
		{/if}
	{:else}
		<P class="w-full">データがありません</P>
	{/if}
</div>
