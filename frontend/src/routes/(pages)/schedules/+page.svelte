<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/utils';
	import { browser } from '$app/environment';
	import Pagination from '$lib/components/organisms/Pagination.svelte';
	import ScheduleItem from '$lib/components/organisms/ScheduleItem.svelte';

	export let data: PageData;

	let stateSearchTerm = data.querySearch;
	let stateStartDate = data.queyStartDate;
	let stateEndDate = data.queryEndDate;
	$: stateSchedules = data.schedules;

	function movePage(event: CustomEvent<number>) {
		refresh(event.detail);
	}

	function refresh(p = 1) {
		const search = `?p=${p}&q=${encodeURIComponent(
			stateSearchTerm
		)}&s=${stateStartDate}&e=${stateEndDate}`;
		if (search != $page.url.search) {
			goto(`${$page.url.pathname}${search}`, {
				keepFocus: true
			});
		}
	}

	$: if (browser) {
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
{#if data.count > 0}
	<div class="grid grid-cols-1 gap-2 not-prose">
		{#each stateSchedules as schedule (schedule.id)}
			<div class="card card-compact border-2 border-base-200 bg-base-300/25 hover:bg-gray-300/10">
				<div class="card-body sm:flex-row sm:items-center">
					<h3 class="card-title !mb-0 !text-base">{formatDate(schedule.date)}</h3>
					<div class="sm:ml-2">
						<ScheduleItem data={schedule.events} />
					</div>
				</div>
			</div>
		{/each}
	</div>
	<div class="flex justify-center my-4">
		<Pagination
			on:page={movePage}
			count={data.count}
			currentPage={data.queryPage}
			pageSize={data.pageSize}
		/>
	</div>
{:else}
	<p>データがありません</p>
{/if}
