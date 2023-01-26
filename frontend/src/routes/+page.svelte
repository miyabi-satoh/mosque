<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Heading, P, Span } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
	{#each data.menuItems as menuItem (menuItem.id)}
		<a
			href={menuItem.url}
			class="flex flex-col h-64 bg-white rounded-lg border border-gray-100 hover:border-white dark:border-gray-700 dark:hover:border-gray-600 hover:shadow-lg dark:hover:shadow-lg-light dark:bg-gray-900"
		>
			<div
				class="w-full bg-gray-50 dark:bg-gray-700 rounded-t-md py-2.5 px-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700"
			>
				<Heading tag="h5" class="text-gray-500 dark:text-white">{menuItem.title}</Heading>
				<Span><Icon icon="mdi:external-link" height="auto" /></Span>
			</div>
			<div class="my-6 mx-4">
				<P>
					{menuItem.description}
				</P>
			</div>
		</a>
	{/each}
</div>
