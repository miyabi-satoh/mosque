<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { formatDate } from '$lib/utils';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import { browser } from '$app/environment';

	export let data: PageData;
	let stateSearchTerm = data.querySearch;

	function movePage(event: CustomEvent<number>) {
		refresh(event.detail);
	}

	function refresh(p = 1) {
		const search = `?p=${p}&q=${encodeURIComponent(stateSearchTerm)}`;
		if (search != $page.url.search) {
			goto(`${$page.url.pathname}${search}`, {
				keepFocus: true
			});
		}
	}

	$: if (browser) {
		stateSearchTerm;
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
</div>

{#if data.infos.length > 0}
	<div class="my-8 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 not-prose">
		{#each data.infos as info (info.id)}
			<a
				class="card card-compact border-2 border-base-200 bg-base-300/25 hover:bg-gray-300/10 transition-all duration-200 hover:shadow hover:-translate-y-1"
				href="/infos/{info.id}"
			>
				<div class="card-body">
					<p color="text-sm">{formatDate(info.updatedAt)}</p>
					<h3 class="card-title">
						{info.title}
					</h3>
					<p class="h-12 line-clamp-2">{info.text}</p>
				</div>
			</a>
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
