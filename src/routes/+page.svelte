<script lang="ts">
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';

	export let data: PageData;
</script>

<main class="container mx-auto max-w-3xl flex-1">
	<div class="grid grid-cols-1 gap-4 p-4">
		{#each data.exam as exam}
			<a href="/{exam.examType}" class="card flex w-full items-center">
				<h2 class="flex-1 pl-4 text-2xl font-semibold">
					{exam.fullName}<span class="ml-4">音声配信</span>
				</h2>
				<Icon icon="mdi:chevron-right" height="64px" />
			</a>
		{/each}
	</div>
</main>
