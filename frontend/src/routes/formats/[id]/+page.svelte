<script lang="ts">
	import { P } from 'flowbite-svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<div class="w-full">
	<P>{data.format?.attributes?.title}</P>
	<P>{data.format?.attributes?.description}</P>
</div>
