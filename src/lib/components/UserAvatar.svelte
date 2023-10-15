<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Avatar } from '@skeletonlabs/skeleton';

	export let width = 'w-12';
	export let height = 48;
	export let src: string | null;
</script>

{#if src}
	<Avatar {src} {width} />
{:else}
	<figure
		class="{width} avatar bg-surface-400-500-token isolate flex aspect-square items-center justify-center overflow-hidden rounded-full"
	>
		<Icon icon="mdi:account" class="object-cover" {height} />
	</figure>
{/if}
