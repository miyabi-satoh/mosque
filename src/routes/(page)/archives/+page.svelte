<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

{#if data.archives.length > 0}
	<ul class="list">
		{#each data.archives as archive}
			<li>{archive.title}</li>
		{/each}
	</ul>
{/if}
