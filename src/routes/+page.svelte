<script lang="ts">
	import { MainContainer } from '$lib';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<MainContainer innerScroll>
	<div class="flex-1 space-y-4 overflow-y-scroll p-4">
		{#each data.exam as exam}
			<a href="/{exam.examType}" class="card flex min-h-[64px] w-full items-center">
				<h2 class="flex-1 py-4 pl-4 text-2xl font-semibold">
					{exam.fullName}<span class="ml-6">音声配信</span>
				</h2>
				<Icon icon="mdi:chevron-right" class="mr-4" height="32px" />
			</a>
		{/each}
		{#each data.siteLinks as siteLink}
			<a href={siteLink.url} class="card flex min-h-[64px] w-full items-center" target="_blank">
				<h2 class="flex-1 py-4 pl-4 text-2xl font-semibold">
					{siteLink.title}
				</h2>
				<Icon icon="mdi:open-in-new" class="mr-4" height="32px" />
			</a>
		{/each}
	</div>
</MainContainer>
