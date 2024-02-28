<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { DefaultLayout } from '$lib';

	export let data: PageData;
</script>

<DefaultLayout {data}>
	<div class="grid grid-cols-1 gap-4 pl-4 pr-2 sm:grid-cols-3">
		{#each data.items as { href, title, external, description }}
			<a {href} class="block" target={external ? '_blank' : '_self'}>
				<div class="card variant-ghost-tertiary card-hover flex h-full items-center p-4 pr-2">
					<div class="mr-1 flex-1">
						<h2 class="h6">{title}</h2>
						<p class="text-xs opacity-50 sm:text-sm">{description}</p>
					</div>
					<Icon icon={external ? 'mdi:open-in-new' : 'mdi:chevron-right'} height="auto" />
				</div>
			</a>
		{/each}
	</div>
</DefaultLayout>
