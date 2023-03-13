<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { API } from '$lib/constants';
	import Pagination from '$lib/components/organisms/Pagination.svelte';

	const ForTypes = {
		all: '',
		staff: 'forStaff',
		teacher: 'forTeacher',
		student: 'forStudent'
	};
	const filters = [
		{ value: ForTypes.all, name: '全て' },
		{ value: ForTypes.staff, name: 'スタッフ用' },
		{ value: ForTypes.teacher, name: '講師用' },
		{ value: ForTypes.student, name: '生徒用' }
	] as const;

	export let data: PageData;
	$: searchReaction(data.querySearch, data.queryFor);
	const searchReaction = (_search: string, _for: string) => {
		console.log('search reaction');
		refresh();
	};

	function movePage(event: CustomEvent<number>) {
		refresh(event.detail);
	}

	function refresh(p = 1) {
		const search = `?p=${p}&q=${encodeURIComponent(data.querySearch)}&f=${data.queryFor}`;
		if (search != $page.url.search) {
			goto(`${$page.url.pathname}${search}`, {
				keepFocus: true
			});
		}
	}

	const handleClick = async (id: number) => {
		// クリックカウントを更新
		const _res = await fetch(API.LINK_CLICK(id));
	};
</script>

<div class="py-4 flex flex-col md:flex-row gap-2">
	<input
		bind:value={data.querySearch}
		type="text"
		placeholder="Search keywords..."
		class="input input-bordered md:flex-1"
	/>
	<select bind:value={data.queryFor} class="select select-bordered flex-none">
		{#each filters as { value, name }}
			<option selected={value == data.queryFor} {value}>{name}</option>
		{/each}
	</select>
</div>

{#if data.links && data.links.length > 0}
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 not-prose">
		{#each data.links as link (link.id)}
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
