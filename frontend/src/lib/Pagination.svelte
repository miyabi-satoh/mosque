<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

	type LinkType = {
		name: string;
		href: string;
		active?: boolean;
	};
	export let pages: LinkType[] = [];

	const dispatch = createEventDispatcher();
	function previous() {
		dispatch('previous');
	}
	function next() {
		dispatch('next');
	}
</script>

<div class="btn-group">
	<button class="btn" on:click={previous}>
		<Icon icon="mdi:chevron-left" />
	</button>
	{#each pages as { name, href, active }}
		<a {href} class="btn {active ? 'btn-active' : ''}">{name}</a>
	{/each}
	<button class="btn" on:click={next}>
		<Icon icon="mdi:chevron-right" />
	</button>
</div>
