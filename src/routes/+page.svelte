<script lang="ts">
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';

	export let data: PageData;
</script>

<main class="container mx-auto flex-1 lg:max-w-3xl">
	<div class="grid grid-cols-1 gap-4 p-4">
		{#each data.exam as exam}
			<a href="/{exam.examType}" class="card flex min-h-[64px] w-full items-center">
				<h2 class="flex-1 py-4 pl-4 text-2xl font-semibold">
					{exam.fullName}<span class="ml-4">音声配信</span>
				</h2>
				<Icon icon="mdi:chevron-right" class="mr-2" height="64px" />
			</a>
		{/each}
		{#each data.siteLinks as siteLink}
			<a href={siteLink.url} class="card flex min-h-[64px] w-full items-center" target="_blank">
				<h2 class="flex-1 py-4 pl-4 text-2xl font-semibold">
					{siteLink.title}
				</h2>
				<Icon icon="mdi:open-in-new" class="mr-4" height="48px" />
			</a>
		{/each}
	</div>
</main>
