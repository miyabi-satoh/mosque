<script lang="ts">
	import type { PageData } from './$types';
	import Markdown from '$lib/Markdown.svelte';
	import { formatDate } from '$lib/utils';
	import ScheduleItem from '$lib/ScheduleItem.svelte';

	export let data: PageData;
	$: pageMeta = data.pageMeta;
	$: menuItems = data.menuItems;
	$: latestInfo = data.latestInfo;
</script>

<svelte:head>
	<title>MOSQUE | Home</title>
</svelte:head>

{#if pageMeta}
	<div class="my-8 text-center lg:text-left">
		<h1>{pageMeta.title}</h1>
		{#if pageMeta.description}
			<p class="my-8">{pageMeta.description}</p>
		{/if}
	</div>
{/if}

{#if latestInfo}
	<div class="my-8">
		<h2 class="mb-4">最新インフォメーション</h2>
		<div class="max-w-none rounded-xl border-2 border-base-200 p-4">
			<div>{formatDate(latestInfo.updated_at)}</div>
			<h3 class="my-0">{latestInfo.title}</h3>
			<Markdown divClass="mt-2" source={latestInfo.text ?? ''} />
		</div>
	</div>
{/if}

{#if data.schedules && data.schedules.length > 0}
	<div class="my-8">
		<h2>直近のスケジュール</h2>
		<ul>
			{#each data.schedules as schedule (schedule.id)}
				<li class="sm:flex gap-4">
					<span>{formatDate(schedule.date)}</span>
					<ScheduleItem data={schedule.events} />
				</li>
			{/each}
		</ul>
	</div>
{/if}

<div class="my-8 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 not-prose">
	{#each menuItems as menuItem (menuItem.id)}
		<a
			class="card card-compact border-2 border-base-200 bg-base-300/25 hover:bg-gray-300/10 transition-all duration-200 hover:shadow hover:-translate-y-1"
			href={menuItem.url}
		>
			<div class="card-body">
				<h3 class="card-title">
					{menuItem.title}
				</h3>
				<p>{menuItem.description}</p>
			</div>
		</a>
	{/each}
</div>
