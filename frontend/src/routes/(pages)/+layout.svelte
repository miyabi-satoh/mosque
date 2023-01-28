<script lang="ts">
	import { Heading, P } from 'flowbite-svelte';
	// import { getLocalToken, removeLocalToken } from '$lib/utils';
	// import { api } from '$lib/api';
	// import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	// import { createMediaQueryStore, mainStore } from '$stores';
	import Breadcrumb from '$lib/Breadcrumb.svelte';

	// let hiddenMainMenu = true;
	// let fixedMainMenu = false;
	// let mql;

	export let data: LayoutData;

	// $: handleChangeMinWidth($mql !== undefined);
	// function handleChangeMinWidth(changed: boolean) {
	// 	if (changed) {
	// 		hiddenMainMenu = !$mql;
	// 		fixedMainMenu = !hiddenMainMenu;
	// 		// console.log(fixedMainMenu);
	// 	}
	// }

	// async function checkLoggedIn() {
	// 	if (!$mainStore.isLoggedIn) {
	// 		let token = $mainStore.token;
	// 		if (!token) {
	// 			const localToken = getLocalToken();
	// 			if (localToken) {
	// 				mainStore.setToken(localToken);
	// 				token = localToken;
	// 			}
	// 		}
	// 		if (token) {
	// 			try {
	// 				const response = await api.getMe(token);
	// 				mainStore.setLoggedIn(true);
	// 				mainStore.setUserProfile(response.data);
	// 			} catch (error) {
	// 				removeLogin();
	// 			}
	// 		} else {
	// 			removeLogin();
	// 		}
	// 	}
	// }

	// function removeLogin() {
	// 	removeLocalToken();
	// 	mainStore.setToken('');
	// 	mainStore.setLoggedIn(false);
	// }

	// onMount(async () => {
	// 	mql = createMediaQueryStore('(min-width: 1024px)');

	// 	await checkLoggedIn();
	// });
</script>

<div class="max-w-3xl 2xl:max-w-4xl mx-auto mt-8">
	<div class="container flex flex-wrap mx-auto">
		<Breadcrumb params={data.breadcrumbParams} navClass="flex pt-16 py-8" />
		<Heading tag="h1">{data.pageInfo?.title}</Heading>
		<P class="w-full my-8">{data.pageInfo?.description}</P>
		<slot />
	</div>
</div>
