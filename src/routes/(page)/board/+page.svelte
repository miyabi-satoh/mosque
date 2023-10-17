<script lang="ts">
	import { browser } from '$app/environment';
	import { Scrollable, UserAvatar } from '$lib';
	import { URLS } from '$lib/consts';
	import Icon from '@iconify/svelte';
	import { formatRelative } from 'date-fns';
	import ja from 'date-fns/locale/ja';
	import { onMount, tick } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	async function onWindowResize() {
		const elements = window.document.querySelectorAll('.truncate');
		elements.forEach((el) => {
			const e = el as HTMLElement;
			e.innerText = '';
		});

		await tick();

		elements.forEach((el) => {
			const e = el as HTMLElement;
			// 改行、スペースを置換
			const content = e.dataset.content
				?.replace(/\r?\n/g, '')
				.replace(/\x20+/g, ' ')
				.replace(/\u3000+/g, ' ');
			if (content) {
				// 参考 - https://qiita.com/s_yasunaga/items/00e1cba8d695d759d5f7
				const fontSize =
					parseInt(
						window.getComputedStyle(e, null).getPropertyValue('font-size').replace('px', ''),
						10
					) + 1;
				const width = e.clientWidth;
				if (width > fontSize * 15) {
					const words = width / fontSize;
					e.innerText = content.length > words ? `${content.slice(0, words)}...` : content;
				}
			}
		});
	}

	onMount(() => {
		if (browser) {
			onWindowResize();
		}
	});
</script>

<svelte:window on:resize={onWindowResize} />
<div class="contents space-y-4">
	<div class="mx-4 flex gap-x-2">
		<input type="text" class="input" id="search" placeholder="Find channels or messages..." />
		{#if data.user}
			<a href="/board/channel" class="variant-ghost-primary btn">
				<span><Icon icon="mdi:rss" height="auto" /></span>
				<span>New</span>
			</a>
		{/if}
	</div>
	{#if data.channels.length > 0}
		<Scrollable class="space-y-4 pl-4 pr-2">
			{#each data.channels as channel}
				<a href="{URLS.BOARD}/{channel.id}" class="block">
					<div class="card card-hover space-y-2 px-4 py-2">
						<div class="flex gap-x-4">
							<h1 class="h5 flex-1 font-semibold sm:h3"># {channel.name}</h1>
						</div>
						<div class="flex gap-x-4 opacity-75">
							{#if channel.lastMessage}
								<div>
									<UserAvatar src={channel.lastMessage.user.avatar} />
								</div>
								<div class="space-y-1">
									<header class="flex items-baseline gap-x-4">
										<span class="text-sm font-semibold sm:text-base">
											{channel.lastMessage.user.displayName ?? channel.lastMessage.user.fullName}
										</span>
										<span class="text-xs opacity-50 sm:text-sm">
											{formatRelative(channel.lastMessage.updatedAt, new Date(), { locale: ja })}
										</span>
									</header>
									<p class="line-clamp-2 text-xs sm:text-sm">{channel.lastMessage.message}</p>
								</div>
							{:else}
								<p class="text-xs sm:text-sm">No messages found on this channel.</p>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</Scrollable>
	{:else}
		<div class="mx-4">No channels.</div>
	{/if}
</div>
