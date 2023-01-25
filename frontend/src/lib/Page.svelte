<script lang="ts">
	import { page } from '$app/stores';
	import { api } from '$lib/api';
	import type { IPage } from '$lib/interfaces';
	import { Heading, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let thisPageInfo: IPage | undefined = undefined;

	onMount(async () => {
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
	<slot />
</div>
