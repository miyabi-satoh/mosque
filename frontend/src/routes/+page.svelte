<script lang="ts">
  import { page } from '$app/stores';
	import { api } from '$lib/api';
	import type { IPage } from '$lib/interfaces';
	import { Heading, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let menuItems: IPage[] = [];
  let thisPageInfo: IPage|undefined = undefined;

	onMount(async () => {
		try {
			const response = await api.getMenuItems();
			if (response.data) {
				menuItems = response.data;
			}
		} catch (error) {
			console.log(`getMenus() error`, error);
		}

		try {
			const response = await api.getPage($page.url.pathname);
			if (response.data) {
				thisPageInfo = response.data;
			}
		} catch (error) {
			console.log(`getMenus() error`, error);
		}
});
</script>

<div class="mt-24">
	<Heading tag="h1">{thisPageInfo?.title}</Heading>
	<P class="w-full my-8">{thisPageInfo?.description}</P>
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
		{#each menuItems as menuItem (menuItem.id)}
			<a
				href={menuItem.url}
				class="flex flex-col h-64 bg-white rounded-lg border border-gray-100 hover:border-white dark:border-gray-700 dark:hover:border-gray-600 hover:shadow-lg dark:hover:shadow-lg-light dark:bg-gray-900"
			>
				<div
					class="w-full bg-gray-50 dark:bg-gray-700 rounded-t-md py-2.5 px-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700"
				>
					<Heading tag="h5" class="text-gray-500 dark:text-gray-400">{menuItem.title}</Heading>
				</div>
				<div class="my-6 mx-4">
					<P>
						{menuItem.description}
					</P>
				</div>
			</a>
		{/each}
	</div>
</div>
