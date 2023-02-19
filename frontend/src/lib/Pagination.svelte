<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	const pageRange = 2; // ページャーに表示する前後のページ数

	export let currentPage: number;
	export let pageSize: number;
	export let count: number;
	$: pageCount = Math.ceil(count / pageSize);
	$: pages = initPages(currentPage, pageSize, count);

	function initPages(_page: number, _pageSize: number, _count: number) {
		// 現在位置からの前後nページを表示
		let start = 0;
		let end = 0;
		if (pageCount <= pageRange * 2 + 1) {
			start = 1;
			end = pageCount;
		} else {
			start = Math.max(currentPage - pageRange, 1);
			end = Math.min(start + pageRange * 2, pageCount);
			if (end == pageCount) {
				start = pageCount - pageRange * 2;
			}
		}

		let retPages: number[] = [];
		for (let i = start; i <= end; i++) {
			retPages.push(i);
		}
		return retPages;
	}

	const dispatch = createEventDispatcher<{ page: number }>();
	function onClick(page: number) {
		dispatch('page', page);
	}
</script>

<div class="btn-group">
	<button class="btn" disabled={currentPage <= 1} on:click={() => onClick(currentPage - 1)}>
		<Icon icon="mdi:chevron-left" height="auto" />
	</button>
	{#each pages as page}
		<button on:click={() => onClick(page)} class="btn" class:btn-active={page == currentPage}
			>{page}</button
		>
	{/each}
	<button class="btn" disabled={currentPage >= pageCount} on:click={() => onClick(currentPage + 1)}>
		<Icon icon="mdi:chevron-right" height="auto" />
	</button>
</div>
