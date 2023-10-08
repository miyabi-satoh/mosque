<script lang="ts">
	import DefaultLayout from '$lib/components/DefaultLayout.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<DefaultLayout {data}>
	<slot />
</DefaultLayout>
