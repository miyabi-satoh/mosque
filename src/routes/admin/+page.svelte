<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="container mx-auto flex-1 lg:max-w-3xl">
	<div class="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3">
		{#each data.menus as { href, label }}
			<a {href} class="card variant-ghost-tertiary card-hover p-4">{label}</a>
		{/each}
	</div>
</main>
