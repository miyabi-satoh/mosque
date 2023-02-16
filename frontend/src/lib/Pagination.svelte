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

	// type LinkType = {
	// 	name: string;
	// 	href: string;
	// 	active?: boolean;
	// };
	// export let pages: LinkType[] = [];

	const dispatch = createEventDispatcher<{ page: number }>();
	// function previous() {
	// 	dispatch('previous');
	// }
	// function next() {
	// 	dispatch('next');
	// }
	function onClick(page: number) {
		dispatch('page', page);
	}
</script>

<div class="btn-group">
	<button
		class="btn"
		on:click={() => {
			if (param.page > 1) {
				onClick(param.page - 1);
			}
		}}
	>
		<Icon icon="mdi:chevron-left" />
	</button>
	{#each pages as page}
		<button on:click={() => onClick(page)} class="btn {page == param.page ? 'btn-active' : ''}"
			>{page}</button
		>
	{/each}
	<button
		class="btn"
		on:click={() => {
			if (param.page < param.pageCount) {
				onClick(param.page + 1);
			}
		}}
	>
		<Icon icon="mdi:chevron-right" />
	</button>
</div>
