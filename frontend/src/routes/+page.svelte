<script lang="ts">
	import type { PageData } from './$types';
	import { formatDate } from '$lib/utils';
	import Markdown from '$lib/Markdown.svelte';

	export let data: PageData;
	$: pageMeta = data.pageMeta;
	$: menuItems = data.menuItems;
	$: latestInfo = data.latestInfo;
</script>

<div class="my-8 text-center lg:text-left">
	<h1>{pageMeta.title}</h1>
	{#if pageMeta.description}
		<p class="w-full my-8">{pageMeta.description}</p>
	{/if}
</div>
{#if latestInfo.meta.pagination.total > 0}
	<div class="max-w-none my-8 rounded-xl border-2 border-base-200 p-6">
		<div>{formatDate(latestInfo.data[0].attributes.updatedAt)}</div>
		<h2 class="my-0">{latestInfo.data[0].attributes.title}</h2>
		<Markdown divClass="mt-2" source={latestInfo.data[0].attributes.text} />
	</div>
{/if}
<div class="my-8 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 not-prose">
	{#each menuItems.data as menuItem (menuItem.id)}
		<a
			class="card card-compact border-2 border-base-200 bg-white/5 hover:bg-gray-300/10 transition-all duration-200 hover:shadow hover:-translate-y-1"
			href={menuItem.attributes.url}
		>
			<div class="card-body">
				<h3 class="card-title">
					{menuItem.attributes.title}
				</h3>
				<p>{menuItem.attributes.description}</p>
			</div>
		</a>
	{/each}
</div>
