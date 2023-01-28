<script lang="ts">
	import { P } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="w-full">
	<P>{data.format?.title}</P>
	<P>{data.format?.description}</P>
</div>
