<script lang="ts">
	import { P } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { mainStore } from '$stores';

	export let data: PageData;
	let objTest = {};

	objTest = {
		filters: {
			hoge: {
				$eq: 'hoge'
			}
		}
	};
	objTest = {
		...objTest,
		filters: {
			fuga: {
				$eq: 'fuga'
			}
		}
	};
	console.log(objTest);
</script>

{#if $mainStore.isLoggedIn}
	<P class="w-full">id = {$mainStore.userProfile?.id}</P>
	<P class="w-full">email = {$mainStore.userProfile?.email}</P>
	<P class="w-full">active = {$mainStore.userProfile?.is_active}</P>
	<P class="w-full">superuser = {$mainStore.userProfile?.is_superuser}</P>
{/if}
