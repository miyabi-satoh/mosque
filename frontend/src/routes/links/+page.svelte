<script lang="ts">
	import { mainState } from '$lib/stores';
	import { apiUrl } from '$lib/utils';
	import { P } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let data: { message: string };
	onMount(async () => {
		const res = await fetch(apiUrl(`tests/`));
		data = await res.json();
		console.log(data);
	});
</script>

<P class="w-full">{data?.message}</P>
{#if $mainState.isLoggedIn}
	<P class="w-full">id = {$mainState.userProfile?.id}</P>
	<P class="w-full">email = {$mainState.userProfile?.email}</P>
	<P class="w-full">active = {$mainState.userProfile?.is_active}</P>
	<P class="w-full">superuser = {$mainState.userProfile?.is_superuser}</P>
{/if}
