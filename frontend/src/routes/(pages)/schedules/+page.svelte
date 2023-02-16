<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ScheduleItem from './ScheduleItem.svelte';
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/utils';
	import Pagination from '$lib/Pagination.svelte';

	export let data: PageData;

	let stateSearchTerm = data.querySearch;
	let stateStartDate = data.queyStartDate;
	let stateEndDate = data.queryEndDate;
	$: pagination = data.schedules.meta.pagination;
	$: stateSchedules = data.schedules.data;

	function movePage(event: CustomEvent<number>) {
		refresh(event.detail);
	}

	function refresh(page = 1) {
		const href = `/schedules?p=${page}&q=${stateSearchTerm}&s=${stateStartDate}&e=${stateEndDate}`;
		goto(href, {
			keepFocus: true
		});
	}

	let mounted = false;
	onMount(() => (mounted = true));
	$: if (mounted) {
		stateSearchTerm;
		stateStartDate;
		stateEndDate;
		refresh();
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
		<input class="input input-bordered" type="date" bind:value={stateStartDate} />
		〜
		<input class="input input-bordered" type="date" bind:value={stateEndDate} />
	</div>
</div>
{#if stateSchedules && stateSchedules.length > 0}
	<div class="grid grid-cols-1 gap-2 not-prose">
		{#each stateSchedules as schedule (schedule.id)}
			<div class="card card-compact border-2 border-base-200 bg-white/5 hover:bg-gray-300/10">
				<div class="card-body sm:flex-row sm:items-center">
					<h3 class="card-title !mb-0 !text-base">{formatDate(schedule.attributes.date)}</h3>
					<div class="sm:ml-2">
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
	{#if pagination.pageCount > 1}
		<div class="flex justify-center my-4">
			<Pagination param={pagination} on:page={movePage} />
		</div>
	{/if}
{:else}
	<p>データがありません</p>
{/if}
