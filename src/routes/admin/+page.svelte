<script lang="ts">
	import { MainContainer } from '$lib';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<MainContainer>
	<div class="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3">
		{#each data.menus as { href, label }}
			<a {href} class="card variant-ghost-tertiary card-hover p-4">{label}</a>
		{/each}
	</div>
</MainContainer>
