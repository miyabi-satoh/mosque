<script lang="ts" context="module">
	export const parentClass = 'flex flex-1 flex-col overflow-hidden';
</script>

<script lang="ts">
	import { innerScrollStore } from '$lib/stores';
	import { tick } from 'svelte';
	import type { ScrollBehavior } from '$lib/types';

	let classes: string = '';
	export let behavior: ScrollBehavior | undefined = undefined;
	export { classes as class };

	function scrollable(_: Element) {
		$innerScrollStore = true;

		return {
			destroy() {
				$innerScrollStore = false;
			}
		};
	}

	function scrollToBottom(node: Element, behavior: ScrollBehavior) {
		if (Math.abs(node.scrollHeight - node.clientHeight - node.scrollTop) >= 1) {
			node.scrollTo({ top: node.scrollHeight, behavior });
		}
	}
	type ScrollBottomOptions = {
		behavior?: ScrollBehavior;
	};
	function scrollBottom(node: Element, _: ScrollBottomOptions) {
		if (behavior !== undefined) {
			tick().then(() => {
				scrollToBottom(node, behavior!);
				behavior = undefined;
			});
		}

		return {
			destroy() {},
			update(_: ScrollBottomOptions) {
				if (behavior !== undefined) {
					tick().then(() => {
						scrollToBottom(node, behavior!);
						behavior = undefined;
					});
				}
			}
		};
	}
</script>

<div class="flex-1 overflow-y-scroll {classes}" use:scrollable use:scrollBottom={{ behavior }}>
	<slot />
</div>
