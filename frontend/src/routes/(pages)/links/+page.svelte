<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Pagination from '$lib/Pagination.svelte';

	type ForType = '' | 'forStaff' | 'forTeacher' | 'forStudent';
	export let data: PageData;

	let stateSearchTerm = $page.url.searchParams.get('q') ?? '';
	let stateFor = ($page.url.searchParams.get('f') ?? '') as ForType;
	$: stateCurrentPageNumber = Number($page.url.searchParams.get('p')) ?? 1;
	$: stateLinks = data.links.stateLinks;
	$: statePageCount = data.links.stateMeta?.pagination?.pageCount ?? 0;
	$: statePages = data.links.statePages;

	const filters: Array<{ value: ForType; name: string }> = [
		{ value: '', name: '全て' },
		{ value: 'forStaff', name: 'スタッフ用' },
		{ value: 'forTeacher', name: '講師用' },
		{ value: 'forStudent', name: '生徒用' }
	];

	async function movePage(page: number) {
		if (page < 1) {
			page = 1;
		} else if (statePageCount < page) {
			page = statePageCount;
		}
		stateCurrentPageNumber = page;
		const href = `/links?p=${page}&q=${stateSearchTerm}&f=${stateFor}`;
		await goto(href, {
			keepFocus: true
		});
	}

	let mounted = false;
	onMount(() => (mounted = true));
	$: if (mounted) {
		stateSearchTerm;
		stateFor;
		movePage(1);
	}
</script>

<div class="py-4 flex flex-col md:flex-row gap-2">
	<input
		bind:value={stateSearchTerm}
		type="text"
		placeholder="Search keywords..."
		class="input input-bordered flex-1"
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
				class="card card-compact border-2 border-base-200 bg-white/5 hover:bg-gray-300/10 transition-all duration-200 hover:shadow hover:-translate-y-1"
				href={link.attributes.url}
				target="_blank"
				rel="noreferrer"
			>
				<div class="card-body">
					<h3 class="card-title">{link.attributes.title}</h3>
					<p>{link.attributes.description}</p>
				</div>
			</a>
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
