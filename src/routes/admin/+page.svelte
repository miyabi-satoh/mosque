<script lang="ts">
	import { URLS } from '$lib/consts';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="container mx-auto flex max-w-3xl flex-1 flex-col overflow-y-hidden">
	<h1 class="p-4 text-4xl font-semibold">試験データ更新</h1>
	<div class="grid grid-cols-2 gap-4 p-4">
		{#each data.exam as exam}
			<a href="{URLS.ADMIN}/{exam.examType}" class="variant-ghost-primary btn w-full rounded"
				>{exam.fullName}</a
			>
		{/each}
	</div>
	<div class="mt-8 flex items-center">
		<h1 class="flex-1 p-4 text-4xl font-semibold">外部サイトへのリンク</h1>
		<a href={URLS.ADMIN_SITELINK} class="variant-ghost-primary btn">追加</a>
	</div>
	<div class="flex-1 space-y-4 overflow-y-scroll p-4">
		{#each data.siteLinks as siteLink}
			<div class="flex items-center gap-x-4">
				<a href={siteLink.url}>{siteLink.title}</a>
				<a class="variant-filled btn btn-sm" href="{URLS.ADMIN_SITELINK}/{siteLink.id}"> 詳細 </a>
			</div>
		{/each}
	</div>
</main>
