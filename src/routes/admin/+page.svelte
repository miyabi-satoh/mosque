<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="m-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
	{#each data.menus as { href, label, icon }}
		<a {href}>
			<div class="card variant-ghost-tertiary card-hover flex items-center p-4">
				{#if icon}
					<div class="mr-4 opacity-25">
						<Icon {icon} height="48" />
					</div>
				{/if}
				{label}
			</div>
		</a>
	{/each}
</div>
