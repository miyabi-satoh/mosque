<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import { userStore } from '$lib/user';

	export let data: PageData;

	$: if (!$userStore || $userStore.id != 1) {
		error(404, 'Not Found');
	}
</script>

<svelte:head>
	<title>MOSQUE | {data.pageMeta?.title}</title>
</svelte:head>

<div class="my-8">
	<h1>管理ページ</h1>
</div>

<div class="my-8">
	<h2>メニュー</h2>
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 not-prose">
		{#each data.pages as item (item.id)}
			<a
				class="card card-compact border-2 border-base-200 bg-base-300/25 hover:bg-gray-300/10 transition-all duration-200 hover:shadow hover:-translate-y-1"
				href={item.url}
			>
				<div class="card-body">
					<h3 class="card-title">
						{item.title}
					</h3>
				</div>
			</a>
		{/each}
	</div>
</div>
