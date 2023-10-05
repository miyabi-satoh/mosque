<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	
export let data: PageData;
</script>

<div class="mx-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
	{#each data.menus as { href, label, icon }}
		<a {href}>
			<div class="card variant-ghost-tertiary card-hover flex items-center gap-x-4 p-4">
				{#if icon}
					<div class="opacity-25">
						<Icon {icon} height="48" />
					</div>
				{/if}
				<h1 class="h6 sm:h5">{label}</h1>
			</div>
		</a>
	{/each}
</div>
