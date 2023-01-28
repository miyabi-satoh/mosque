<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Card, Heading, P, Span } from 'flowbite-svelte';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
	{#each data.menuItems as menuItem (menuItem?.id)}
		<Card padding="none" href={menuItem?.attributes?.url}>
			<div
				class="w-full bg-gray-50 dark:bg-gray-700 rounded-t-md py-2.5 px-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700"
			>
				<Heading tag="h5" class="text-gray-500 dark:text-white"
					>{menuItem?.attributes?.title}</Heading
				>
				<Span><Icon icon="mdi:external-link" height="auto" /></Span>
			</div>
			<div class="my-6 mx-4">
				<P>
					{menuItem?.attributes?.description}
				</P>
			</div>
		</Card>
	{/each}
</div>
