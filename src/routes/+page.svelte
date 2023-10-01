<script lang="ts">
	import { MainContainer } from '$lib';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<MainContainer innerScroll>
	<div class="m-4 flex-1 space-y-4 overflow-y-scroll">
		{#each data.exam as exam}
			<a href="/{exam.examType}" class="card flex min-h-[64px] w-full items-center p-4">
				<h2 class="h2 flex-1">
					{exam.name}アーカイブ
				</h2>
				<Icon icon="mdi:chevron-right" height="32px" />
			</a>
		{/each}
		{#each data.links as link}
			<a href={link.url} class="card flex min-h-[64px] w-full items-center p-4" target="_blank">
				<h2 class="h2 flex-1">
					{link.title}
				</h2>
				<Icon icon="mdi:open-in-new" height="32px" />
			</a>
		{/each}
	</div>
</MainContainer>
