<script lang="ts">
	import { ChevronLeft, ChevronRight, Pagination } from 'flowbite-svelte';
	import type { LinkType } from 'flowbite-svelte/types';
	import { createEventDispatcher } from 'svelte';

	export let pages: LinkType[] = [];
	export let divClass = 'flex justify-center mt-4';

	const dispatch = createEventDispatcher();
	function previous() {
		dispatch('previous');
	}
	function next() {
		dispatch('next');
	}
</script>

<div class={divClass}>
	<Pagination {pages} on:previous={previous} on:next={next} icon>
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
