<script lang="ts">
	import { UserAvatar } from '$lib';
	import { URLS } from '$lib/consts';
	import type { MessageWithUser } from '$lib/server/db';
	import { formatDate } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { getModalStore } from '@skeletonlabs/skeleton';

	// eslint-disable-next-line
	export let parent: any;

	const modalStore = getModalStore();

	let search = '';
	let messages: MessageWithUser[] = [];
	let controller: AbortController;
	async function onSearchInput(e: Event) {
		const el = e.target as HTMLInputElement;
		search = el.value.trim();
		if (search) {
			if (controller) {
				controller.abort();
			}
			controller = new AbortController();

			const body = new FormData();
			body.append(el.name, search);

			try {
				const res = await fetch('/api/search', {
					method: 'post',
					body,
					signal: controller.signal
				});
				if (!res.ok) {
					throw new Error(`status = ${res.status}, statusText = ${res.statusText}`);
				}
				const json = await res.json();
				messages = json.map((m: MessageWithUser): MessageWithUser => {
					return {
						...m,
						createdAt: new Date(m.createdAt),
						updatedAt: new Date(m.updatedAt)
					};
				});
			} catch (e) {
				console.log(e);
			}
		}
	}
</script>

{#if $modalStore[0]}
	<div class="card bg-surface-300-600-token w-modal mb-auto mt-24 overflow-hidden shadow-xl">
		<header class="flex items-center">
			<span class="ml-4">
				<Icon icon="mdi:magnify" height="auto" />
			</span>
			<input
				class="w-full border-0 bg-transparent p-4 focus:outline-0 focus:ring-0"
				type="search"
				name="search"
				placeholder="Find messages..."
				on:input={onSearchInput}
			/>
			<button class="variant-filled btn-icon btn-icon-sm mr-4" on:click={parent.onClose}>
				<Icon icon="mdi:close" height="20" />
			</button>
		</header>
		{#if search}
			<hr class="!border-surface-500-400-token" />
			<nav class="list-nav max-h-[480px] overflow-y-auto" tabindex="-1">
				{#if messages.length > 0}
					<ul>
						{#each messages as m (m.id)}
							<li>
								<a
									class="w-full !rounded-none hover:variant-soft focus:!variant-filled-primary"
									href={URLS.BOARD(m.channelId)}
									on:click={parent.onClose}
								>
									<div class="flex gap-x-4 opacity-75">
										<div>
											<UserAvatar src={m.user.avatar} />
										</div>
										<div class="space-y-1">
											<header class="flex items-baseline gap-x-4">
												<span class="text-sm font-semibold sm:text-base">
													{m.user.displayName ?? m.user.fullName}
												</span>
												<span class="text-xs opacity-50 sm:text-sm">
													{formatDate(m.updatedAt)}
												</span>
											</header>
											<p class="line-clamp-2 whitespace-normal text-xs sm:text-sm">{m.message}</p>
										</div>
									</div>
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<div class="my-8 text-center text-xl opacity-50">
						No results for "{search}"
					</div>
				{/if}
			</nav>
		{/if}
	</div>
{/if}
