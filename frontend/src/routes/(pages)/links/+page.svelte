<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import { browser } from '$app/environment';

	const ForTypes = {
		all: '',
		staff: 'forStaff',
		teacher: 'forTeacher',
		student: 'forStudent'
	};
	type ForType = (typeof ForTypes)[keyof typeof ForTypes];

	export let data: PageData;

	let stateSearchTerm = data.querySearch;
	let stateFor = data.queryFor;
	$: stateLinks = data.links;

	const filters: Array<{ value: ForType; name: string }> = [
		{ value: ForTypes.all, name: '全て' },
		{ value: ForTypes.staff, name: 'スタッフ用' },
		{ value: ForTypes.teacher, name: '講師用' },
		{ value: ForTypes.student, name: '生徒用' }
	];

	function movePage(event: CustomEvent<number>) {
		refresh(event.detail);
	}

	function refresh(p = 1) {
		const search = `?p=${p}&q=${encodeURIComponent(stateSearchTerm)}&f=${stateFor}`;
		if (search != $page.url.search) {
			goto(`${$page.url.pathname}${search}`, {
				keepFocus: true
			});
		}
	}

	$: if (browser) {
		stateSearchTerm;
		stateFor;
		refresh();
	}

	const handleClick = async (id: number) => {
		// クリックカウントを更新
		const _res = await fetch(`/api/link/${id}/click`);
	};
</script>

<div class="py-4 flex flex-col md:flex-row gap-2">
	<input
		bind:value={stateSearchTerm}
		type="text"
		placeholder="Search keywords..."
		class="input input-bordered md:flex-1"
	/>
	<select bind:value={stateFor} class="select select-bordered flex-none">
		{#each filters as { value, name }}
			<option selected={value == stateFor} {value}>{name}</option>
		{/each}
	</select>
</div>

{#if stateLinks && stateLinks.length > 0}
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 not-prose">
		{#each stateLinks as link (link.id)}
			<a
				class="card card-compact border-2 border-base-200 bg-base-300/25 hover:bg-gray-300/10 transition-all duration-200 hover:shadow hover:-translate-y-1"
				href={link.url}
				target="_blank"
				rel="noreferrer"
				on:click={() => handleClick(link.id)}
			>
				<div class="card-body">
					<h3 class="card-title">{link.title}</h3>
					<p>{link.description}</p>
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
