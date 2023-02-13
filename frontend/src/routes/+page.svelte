<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { formatDate } from '$lib/utils';
	import Markdown from '$lib/Markdown.svelte';

	export let data: PageData;
	$: pageMeta = data.pageMeta;
	$: menuItems = data.menuItems;
	$: latestInfo = data.latestInfo;
</script>

<div
	class="prose relative  overflow-hidden mt-24 lg:mb-8 mx-auto 2xl:px-8 text-center lg:text-left"
>
	<h1>{pageMeta.title}</h1>
	{#if pageMeta.description}
		<p class="w-full my-8">{pageMeta.description}</p>
	{/if}
</div>
{#if latestInfo.meta.pagination.total > 0}
	<div class="prose max-w-none my-8 rounded-xl border p-2 sm:p-6">
		<p>{formatDate(latestInfo.data[0].attributes.updatedAt)}</p>
		<h2>{latestInfo.data[0].attributes.title}</h2>
		<Markdown divClass="mt-2 prose" source={latestInfo.data[0].attributes.text} />
	</div>
{/if}
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
	{#each menuItems.data as menuItem (menuItem.id)}
		<div class="card card-compact border rounded-xl shadow-lg">
			<a class="card-title link px-4 pt-4" href={menuItem.attributes.url}>
				<h3>{menuItem.attributes.title}</h3>
				<Icon icon="mdi:external-link" height="auto" />
			</a>
			<div class="card-body">
				{menuItem.attributes.description}
			</div>
		</div>
	{/each}
</div>
