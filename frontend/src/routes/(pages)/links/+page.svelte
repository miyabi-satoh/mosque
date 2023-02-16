<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/Pagination.svelte';

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
	$: pagination = data.links.meta.pagination;
	$: stateLinks = data.links.data;

	const filters: Array<{ value: ForType; name: string }> = [
		{ value: ForTypes.all, name: '全て' },
		{ value: ForTypes.staff, name: 'スタッフ用' },
		{ value: ForTypes.teacher, name: '講師用' },
		{ value: ForTypes.student, name: '生徒用' }
	];

	function movePage(event: CustomEvent<number>) {
		refresh(event.detail);
	}

	function refresh(page = 1) {
		const href = `/links?p=${page}&q=${stateSearchTerm}&f=${stateFor}`;
		goto(href, {
			keepFocus: true
		});
	}

	let mounted = false;
	onMount(() => (mounted = true));
	$: if (mounted) {
		stateSearchTerm;
		stateFor;
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
	{#if pagination.pageCount > 1}
		<div class="flex justify-center my-4">
			<Pagination param={pagination} on:page={movePage} />
		</div>
	{/if}
{:else}
	<p>データがありません</p>
{/if}
