<script lang="ts" context="module">
	export const parentClass = 'flex flex-1 flex-col overflow-hidden';
</script>

<script lang="ts">
	import { innerScrollStore } from '$lib/stores';
	import { onMount } from 'svelte';

	let classes: string = '';
	export { classes as class };

	onMount(() => {
		$innerScrollStore = true;

		return () => {
			$innerScrollStore = false;
		};
	});
</script>

<div class="flex-1 overflow-y-scroll {classes}">
	<slot />
</div>
