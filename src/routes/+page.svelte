<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="mx-4 space-y-4">
	{#each data.items as { href, title, external }}
		<a {href} class="block" target={external ? '_blank' : '_self'}>
			<div class="card variant-ghost-tertiary card-hover flex items-center p-4">
				<h1 class="h6 flex-1 sm:h3">{title}</h1>
				<Icon icon={external ? 'mdi:open-in-new' : 'mdi:chevron-right'} height="auto" />
			</div>
		</a>
	{/each}
</div>
