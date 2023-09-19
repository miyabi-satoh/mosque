<script lang="ts">
	import { URLS } from '$lib/consts';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="container mx-auto max-w-3xl flex-1">
	<h1 class="p-4 text-4xl font-semibold">試験データ更新</h1>
	<div class="grid grid-cols-2 gap-4 p-4">
		{#each data.exam as exam}
			<a href="{URLS.ADMIN}/{exam.examType}" class="variant-ghost-primary btn w-full rounded"
				>{exam.fullName}</a
			>
		{/each}
	</div>
</main>
