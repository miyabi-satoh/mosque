<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import { browser } from '$app/environment';

	export let data: PageData;

	let stateSearchTerm = data.querySearch;
	$: stateResources = data.resources;

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

	const handleClick = async (id: number) => {
		// console.log(`handleClick ${id}`);
		const res = await fetch(`/api/resource/${id}/click`);
		console.log(res.status);
	};
</script>

<div class="py-4 flex flex-col md:flex-row gap-2">
	<input
		bind:value={stateSearchTerm}
		type="text"
		placeholder="Search keywords..."
		class="input input-bordered md:flex-1"
	/>
</div>

{#if data.count > 0}
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 not-prose">
		{#each stateResources as resource (resource.id)}
			<a
				class="card card-compact border-2 border-base-200 bg-base-300/25 hover:bg-gray-300/10 transition-all duration-200 hover:shadow hover:-translate-y-1"
				href="{$page.url.pathname}/{resource.id}"
				on:click={() => handleClick(resource.id)}
			>
				<div class="card-body">
					<h3 class="card-title">{resource.title}</h3>
					<p>{resource.description ?? ''}</p>
					<div class="card-actions">
						{#each resource.assets as asset}
							<div class="badge badge-outline">{asset?.slug}</div>
						{/each}
					</div>
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
