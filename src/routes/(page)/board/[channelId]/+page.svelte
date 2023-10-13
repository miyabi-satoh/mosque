<script lang="ts">
	import { URLS } from '$lib/consts';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { AutoResizeTextarea, Scrollable } from '$lib';
	import {
		popup,
		type ModalComponent,
		type PopupSettings,
		type ModalSettings,
		getModalStore
	} from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
	import { submittingStore } from '$lib/stores';
	import { formatRelative } from 'date-fns';
	import ja from 'date-fns/locale/ja';
	import { onMount, tick } from 'svelte';
	import { browser } from '$app/environment';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import EditModal from './EditModal.svelte';

	export let data: PageData;
	const { form, message, errors, submitting, constraints, enhance } = superForm(data.form);
	$: $submittingStore = $submitting;

	const popupMenuClasses = 'flex w-full gap-x-2 rounded px-4 py-2 hover:bg-primary-500/10';
	function popupClick(i: number): PopupSettings {
		return {
			event: 'click',
			target: `popupClick-${i}`,
			placement: 'bottom',
			closeQuery: 'li'
		} satisfies PopupSettings;
	}

	const chatElemId = 'chat';
	async function scrollChatBottom(behavior?: ScrollBehavior): Promise<void> {
		const el = window.document.getElementById(chatElemId);
		if (el) {
			await tick();
			if (Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) >= 1) {
				el.scrollTo({ top: el.scrollHeight, behavior });
			}
		}
	}

	function showRelativeDate(date: Date): string {
		return formatRelative(date, new Date(), { locale: ja });
	}

	// function onMessageInput(e: Event): void {
	// 	autoResizeTextarea(e.target as HTMLElement);
	// }

	// function autoResizeTextarea(el: HTMLElement | null): void {
	// 	if (el) {
	// 		el.style.height = 'auto';
	// 		el.style.height = `${el.scrollHeight}px`;
	// 	}
	// }

	const modalStore = getModalStore();
	type Message = PageData['messages'][0];
	function onEditClick(m: Message): void {
		// console.log(m.message);
		const component: ModalComponent = { ref: EditModal };
		const modal: ModalSettings = {
			type: 'component',
			component,
			meta: {
				message: m.message
			},
			response: (r: string) => {
				if (r) {
					console.log(r);
					m.message = r;
				}
			}
		};
		modalStore.trigger(modal);
		// data.messages = data.messages;
	}

	onMount(() => {
		if (browser) {
			// autoResizeTextarea(window.document.getElementById('message'));
			scrollChatBottom();
		}
	});
</script>

<div class="contents space-y-4">
	<div class="mx-4 flex gap-4">
		<span class="text-sm opacity-50">
			{data.channel.description}
		</span>
		<div class="flex flex-col gap-2">
			<Icon icon="mdi:information" height="auto" />
			<a href="{URLS.BOARD_CHANNEL}/{data.channel.id}">
				<Icon icon="mdi:cog" height="auto" />
			</a>
		</div>
	</div>
	<hr />
	<Scrollable class="space-y-4 px-4" id={chatElemId}>
		{#each data.messages as m, i}
			<div class="flex gap-2">
				<div class:order-last={m.userId === data.user?.userId}>
					<UserAvatar src={m.user.avatar} />
				</div>
				<div
					class="card flex-1 space-y-2 rounded-tr-none p-4"
					class:variant-glass-tertiary={m.userId === data.user?.userId}
					class:variant-soft={m.userId !== data.user?.userId}
				>
					<header class="flex items-center gap-2">
						<p class="flex flex-1 items-end gap-x-4">
							<span class="font-bold">{m.user.displayName ?? m.user.fullName}</span>
							<span class="text-sm opacity-50">{showRelativeDate(m.updatedAt)}</span>
						</p>
						{#if m.userId === data.user?.userId}
							<div>
								<button use:popup={popupClick(i)}>
									<Icon icon="mdi:dots-horizontal" height="auto" />
								</button>
							</div>
							<div class="card w-48 p-2 shadow-xl" data-popup="popupClick-{i}">
								<ul>
									<li>
										<button class={popupMenuClasses} on:click={() => onEditClick(m)}>
											<Icon icon="mdi:pencil" height="auto" />
											<span>Edit</span>
										</button>
									</li>
									<li>
										<button class="text-error-400-500-token {popupMenuClasses}">
											<Icon icon="mdi:delete" height="auto" />
											<span>Delete</span>
										</button>
									</li>
								</ul>
								<div class="bg-surface-100-800-token arrow" />
							</div>
						{/if}
					</header>
					<p>{m.message}</p>
				</div>
			</div>
		{/each}
		{#if $message}
			<div class="bg-surface-100-800-token text-error-400-500-token rounded-3xl px-4 py-2">
				{$message}
			</div>
		{/if}
	</Scrollable>
	{#if data.user}
		<form class="mx-4" method="post">
			<div class="flex items-end gap-2">
				<AutoResizeTextarea target="message" />
				<textarea
					class="textarea max-h-96 resize-none overflow-y-auto text-sm"
					name="message"
					id="message"
					rows="1"
					placeholder="Message #{data.channel.name}"
					class:input-error={$errors.message}
					bind:value={$form.message}
					disabled={$submitting}
					{...$constraints.message}
				/>
				<button type="submit" class="variant-ghost-primary btn" disabled={$submitting}>
					<span><Icon icon="mdi:send" height="auto" /></span>
					<span class="hidden sm:block">Send</span>
				</button>
			</div>
		</form>
	{/if}
</div>
