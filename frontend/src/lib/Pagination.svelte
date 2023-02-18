<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	const pageRange = 2; // ページャーに表示する前後のページ数

	type PaginationType = {
		page: number;
		pageSize: number;
		pageCount: number;
		total: number;
	};
	export let param: PaginationType;
	$: pages = initPages(param);

	function initPages(_param: PaginationType) {
		// 現在位置からの前後nページを表示
		let start = 0;
		let end = 0;
		if (param.pageCount <= pageRange * 2 + 1) {
			start = 1;
			end = param.pageCount;
		} else {
			start = Math.max(param.page - pageRange, 1);
			end = Math.min(start + pageRange * 2, param.pageCount);
			if (end == param.pageCount) {
				start = param.pageCount - pageRange * 2;
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
	<button class="btn" disabled={param.page <= 1} on:click={() => onClick(param.page - 1)}>
		<Icon icon="mdi:chevron-left" />
	</button>
	{#each pages as page}
		<button on:click={() => onClick(page)} class="btn" class:btn-active={page == param.page}
			>{page}</button
		>
	{/each}
	<button
		class="btn"
		disabled={param.page >= param.pageCount}
		on:click={() => onClick(param.page + 1)}
	>
		<Icon icon="mdi:chevron-right" />
	</button>
</div>
