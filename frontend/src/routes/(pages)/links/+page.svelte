<script lang="ts">
	import Icon from '@iconify/svelte';
	import {
		A,
		Button,
		ChevronLeft,
		ChevronRight,
		P,
		Pagination,
		Search,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	type ForType = '' | 'forStaff' | 'forTeacher' | 'forStudent';
	export let data: PageData;

	let inputSearchTerm = $page.url.searchParams.get('q') || '';
	let inputFor = ($page.url.searchParams.get('f') || '') as ForType;
	let stateSearchTerm = inputSearchTerm;
	let stateFor = inputFor;
	$: stateCurrentPageNumber = Number($page.url.searchParams.get('p')) || 1;
	$: stateLinks = data.links.stateLinks;
	$: statePageCount = data.links.stateMeta?.pagination?.pageCount || 0;
	$: statePages = data.links.statePages;

	const filters: Array<{ value: ForType; name: string }> = [
		{ value: '', name: '全て' },
		{ value: 'forStaff', name: 'スタッフ用' },
		{ value: 'forTeacher', name: '講師用' },
		{ value: 'forStudent', name: '生徒用' }
	];

	// $: movePage(stateCurrentPageNumber);
	async function movePage(page: number) {
		console.log(page, statePageCount);
		if (page < 1) {
			page = 1;
		} else if (statePageCount < page) {
			page = statePageCount;
		}
		stateCurrentPageNumber = page;
		const href = `/links?p=${page}&q=${stateSearchTerm}&f=${stateFor}`;
		await goto(href);
	}

	async function handleSubmit() {
		stateSearchTerm = inputSearchTerm;
		stateFor = inputFor;
		await movePage(1);
	}
</script>

<div class="w-full">
	<form class="py-4 flex flex-col md:flex-row gap-2" on:submit|preventDefault={handleSubmit}>
		<Search
			size="md"
			class="flex flex-1 gap-2 items-center"
			placeholder="Search keywords..."
			bind:value={inputSearchTerm}
		/>
		<Select class="!w-auto" placeholder="" bind:value={inputFor}>
			{#each filters as { value, name }}
				<option selected={value == inputFor} {value}>{name}</option>
			{/each}
		</Select>
		<Button size="sm" class="flex-none" type="submit">検索</Button>
	</form>
	{#if stateLinks && stateLinks.length > 0}
		<Table striped={true} divClass="relative overflow-x-auto">
			<TableHead
				class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400"
			>
				<TableHeadCell>Title</TableHeadCell>
				<TableHeadCell>Description</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each stateLinks as link (link.id)}
					<TableBodyRow>
						<TableBodyCell>
							<A target="_blank" href={link.attributes?.url}>
								<span class="mr-2">{link.attributes?.title}</span>
								<Icon icon="mdi:external-link" />
							</A></TableBodyCell
						>
						<TableBodyCell tdClass="px-6 py-4 lg:whitespace-nowrap"
							>{link.attributes?.description}</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>

		{#if statePageCount > 1}
			<div class="flex justify-center mt-4">
				<Pagination
					bind:pages={statePages}
					on:previous={() => movePage(stateCurrentPageNumber - 1)}
					on:next={() => movePage(stateCurrentPageNumber + 1)}
					icon
				>
					<svelte:fragment slot="prev">
						<span class="sr-only">Previous</span>
						<ChevronLeft class="w-5 h-5" />
					</svelte:fragment>
					<svelte:fragment slot="next">
						<span class="sr-only">Next</span>
						<ChevronRight class="w-5 h-5" />
					</svelte:fragment>
				</Pagination>
			</div>
		{/if}
	{:else}
		<P class="w-full">データがありません</P>
	{/if}
</div>
