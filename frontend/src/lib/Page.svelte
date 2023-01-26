<script lang="ts">
	import { Heading, P } from 'flowbite-svelte';
	import type { IPage } from '$lib/interfaces';

	export let info: IPage | undefined = undefined;
</script>

<div class="mt-24">
	<Heading tag="h1">{info?.title}</Heading>
	<P class="w-full my-8">{info?.description}</P>
	<slot />
</div>
