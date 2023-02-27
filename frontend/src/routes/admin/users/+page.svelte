<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import { browser } from '$app/environment';

	export let data: PageData;

	function movePage(event: CustomEvent<number>) {
		refresh(event.detail);
	}

	function refresh(p = 1) {
		const search = `?p=${p}&q=${encodeURIComponent(data.querySearch)}`;
		if (search != $page.url.search) {
			goto(`${$page.url.pathname}${search}`, {
				keepFocus: true
			});
		}
	}

	$: if (browser) {
		data.querySearch;
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
		bind:value={data.querySearch}
		type="text"
		placeholder="Search keywords..."
		class="input input-bordered md:flex-1"
	/>
</div>

{#if data.count > 0}
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 not-prose">
		{#each data.users as user (user.id)}
			<a
				class="card card-compact border-2 border-base-200 bg-base-300/25 hover:bg-gray-300/10 transition-all duration-200 hover:shadow hover:-translate-y-1"
				href="{$page.url.pathname}/{user.id}"
				on:click={() => handleClick(user.id)}
			>
				<div class="card-body">
					<h3 class="card-title">{user.username}</h3>
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
