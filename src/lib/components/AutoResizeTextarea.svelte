<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	export let target: string;

	function autoResizeTextarea(el: HTMLElement): void {
		// console.log(`autoResizeTextarea`);
		el.style.height = 'auto';
		el.style.height = `${el.scrollHeight}px`;
	}

	onMount(() => {
		if (browser) {
			const el = window.document.getElementById(target);
			if (el) {
				autoResizeTextarea(el);
				el.addEventListener('input', (ev: Event) => {
					autoResizeTextarea(el);
				});
			}
		}
	});
</script>
