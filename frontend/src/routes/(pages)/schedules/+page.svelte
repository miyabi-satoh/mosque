<script lang="ts">
	import { onMount } from 'svelte';
	import { format } from 'date-fns';
	import type { PageData } from './$types';
	import ScheduleItem from './ScheduleItem.svelte';
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
		movePage(1);
	}
</script>

<div class="py-4 flex flex-col md:flex-row gap-2">
	<input
		bind:value={stateSearchTerm}
		type="text"
		placeholder="Search keywords..."
		class="input input-bordered md:flex-1"
	/>
	<div class="flex items-center gap-2">
		<input class="input input-bordered" type="date" bind:value={inputStartDate} />
		〜
		<input class="input input-bordered" type="date" bind:value={inputEndDate} />
	</div>
</div>
{#if stateSchedules && stateSchedules.length > 0}
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 not-prose">
		{#each stateSchedules as schedule (schedule.id)}
			<div class="card card-compact border-2 border-base-200 bg-white/5 hover:bg-gray-300/10">
				<div class="card-body">
					<h3 class="card-title">{formatDate(schedule.attributes.date)}</h3>
					<div>
						{#each schedule.attributes.schedules.data as event (event.id)}
							<ScheduleItem
								name={event.attributes.name}
								start={event.attributes.start}
								end={event.attributes.end}
							/>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>
	{#if statePageCount > 1}
		<div class="flex justify-center my-4">
			<Pagination
				pages={statePages}
				on:previous={() => movePage(stateCurrentPageNumber - 1)}
				on:next={() => movePage(stateCurrentPageNumber + 1)}
			/>
		</div>
	{/if}
{:else}
	<p>データがありません</p>
{/if}
