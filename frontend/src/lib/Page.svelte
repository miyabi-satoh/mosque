<script lang="ts">
	import { api } from '$lib/api';
	import type { IPage } from '$lib/interfaces';
	import { Heading, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let info: IPage | undefined = undefined;
</script>

<div class="mt-24">
	<Heading tag="h1">{info?.title}</Heading>
	<P class="w-full my-8">{info?.description}</P>
	<slot />
</div>
