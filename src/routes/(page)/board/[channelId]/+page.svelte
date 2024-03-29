<script lang="ts">
	import { browser } from '$app/environment';
	import { DeleteButton, SubmitButton, UserAvatar } from '$lib';
	import { scrollToBottom } from '$lib/actions/scrollToBottom';
	import { scrollable } from '$lib/actions/scrollable';
	import { URLS, WS_EVENT_MESSAGEUPDATED } from '$lib/consts';
	import { submittingStore } from '$lib/stores';
	import type { ScrollBehavior } from '$lib/types';
	import { formatDate, hasAdminRole } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import {
		getModalStore,
		popup,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import DOMPurify from 'dompurify';
	import { marked } from 'marked';
	import { io } from 'socket.io-client';
	import { onMount, tick } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import EditModal from './EditModal.svelte';
	import './style.postcss';

	marked.use({
		breaks: true
	});

	const socket = io();

	const postCreateButtonId = 'button-post-create';
	const postUpdateButtonId = 'button-post-update';
	const postDeleteButtonId = 'button-post-delete';
	const popupMenuClasses = 'flex w-full gap-x-2 rounded px-4 py-2 hover:bg-primary-500/10';

	export let data: PageData;
	const { form, message, submitting, enhance } = superForm(data.form, {
		onUpdated: ({ form }) => {
			if (form.valid) {
				if (!form.data.id) scrollBehavior = 'smooth';
				socket.emit(WS_EVENT_MESSAGEUPDATED, data.channel.id);
				console.log(`Client emit ${WS_EVENT_MESSAGEUPDATED}`);
			}
		}
	});
	$: $submittingStore = $submitting;

	const modalStore = getModalStore();
	type Message = PageData['messages'][0];

	let formData: Message | undefined;
	function onEditClick(objMessage: Message): void {
		const component: ModalComponent = { ref: EditModal };
		const modal: ModalSettings = {
			type: 'component',
			component,
			meta: {
				message: objMessage.message
			},
			response: (r: string) => {
				if (r.length > 0) {
					formData = {
						...objMessage,
						message: r
					};
					tick().then(() => {
						window.document.getElementById(postUpdateButtonId)?.click();
					});
				}
			}
		};
		modalStore.trigger(modal);
	}

	function onDeleteClick(objMessage: Message): void {
		// setTimeoutでPopupが消えるのを待つ
		setTimeout(() => {
			formData = {
				...objMessage
			};
			// tick()でフォーム要素のvalueが更新されるのを待つ
			tick().then(() => {
				window.document.getElementById(postDeleteButtonId)?.click();
			});
		}, 250);
	}

	function onKeydown(event: CustomEvent<KeyboardEvent>): void {
		const e = event.detail;
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			const el = window.document.getElementById(postCreateButtonId);
			if (el) {
				el.click();
			}
		}
	}
	let scrollBehavior: ScrollBehavior = 'auto';

	onMount(() => {
		socket.on(WS_EVENT_MESSAGEUPDATED, async (channelId) => {
			if (channelId !== data.channel.id) return;

			try {
				const res = await fetch(URLS.API_CHANNEL(data.channel.id));
				if (!res.ok) {
					throw new Error(
						`response.status = ${res.status}, response.statusText = ${res.statusText}`
					);
				}
				const messages = await res.json();
				// 日時が文字列になっているのでDate型に変換する
				data.messages = messages.map((m: Message): Message => {
					return {
						...m,
						createdAt: new Date(m.createdAt),
						updatedAt: new Date(m.updatedAt)
					};
				});
			} catch (e) {
				console.log(e);
			}
		});
	});

	const MarkdownToHtml = async (message: string) =>
		DOMPurify.sanitize(await marked.parse(message, { async: true }));
</script>

<form class="contents" method="post" use:enhance>
	<input type="hidden" name="id" value={formData?.id} />
	<input type="hidden" name="message" value={formData?.message} />
	<button id={postUpdateButtonId} class="hidden" />
	<DeleteButton id={postDeleteButtonId} item="message" class="hidden" />
</form>

<div class="contents space-y-4">
	<div class="mx-4 flex gap-4">
		<span class="flex-1 text-xs opacity-50 sm:text-sm">
			{data.channel.description}
		</span>
		<div class="flex flex-col gap-2">
			<!-- <Icon icon="mdi:information" height="auto" /> -->
			{#if data.channel.createdBy === data.user?.id || hasAdminRole(data.user)}
				<a href="{URLS.BOARD_CHANNEL}/{data.channel.id}">
					<Icon icon="mdi:cog" height="auto" />
				</a>
			{/if}
		</div>
	</div>
	<hr />
	<div class="flex-1 space-y-4 pl-4 pr-2" use:scrollable use:scrollToBottom={scrollBehavior}>
		{#each data.messages as m (m.id)}
			<div class="flex gap-2">
				<div class:order-last={m.userId === data.user?.id}>
					<UserAvatar src={m.user.avatar} />
				</div>
				<div
					class="card flex-1 space-y-1 rounded-tr-none px-4 py-2"
					class:variant-glass-tertiary={m.userId === data.user?.id}
					class:variant-soft={m.userId !== data.user?.id}
				>
					<header class="flex items-center">
						<p class="flex flex-1 items-baseline gap-x-4">
							<span class="text-sm font-bold sm:text-base"
								>{m.user.displayName ?? m.user.fullName}</span
							>
							<span class="text-xs opacity-50 sm:text-sm">{formatDate(m.updatedAt)}</span>
						</p>
						{#if m.userId === data.user?.id || hasAdminRole(data.user)}
							<div>
								<button
									use:popup={{
										event: 'click',
										target: `popupClick-${m.id}`,
										placement: 'bottom',
										closeQuery: 'li'
									}}
								>
									<Icon icon="mdi:dots-horizontal" height="auto" />
								</button>
							</div>
						{/if}
					</header>
					<article class="marked">
						{#if browser}
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html MarkdownToHtml(m.message)}
						{/if}
					</article>
				</div>
			</div>
		{/each}

		{#if $message}
			<div class="bg-surface-100-800-token text-error-400-500-token rounded-3xl px-4 py-2">
				{$message}
			</div>
		{/if}
	</div>
	{#if data.user}
		<div>
			<hr />
			<form class="mx-4 mt-2" method="post" use:enhance>
				<div class="flex items-end gap-2">
					{#await import('$lib/components/MarkdownEditor.svelte') then Module}
						<Module.default
							name="message"
							class="flex-1"
							placeholder="Message #{data.channel.name}"
							bind:value={$form.message}
							on:keydown={onKeydown}
						/>
					{/await}
					<SubmitButton id={postCreateButtonId} disabled={$submitting}>
						<span><Icon icon="mdi:send" height="auto" /></span>
						<span class="hidden sm:block">Send</span>
					</SubmitButton>
				</div>
			</form>
		</div>
	{/if}
</div>
{#each data.messages as m (m.id)}
	<div class="card w-48 p-2 shadow-xl" data-popup="popupClick-{m.id}">
		<ul>
			<li>
				<button class={popupMenuClasses} on:click={() => onEditClick(m)}>
					<Icon icon="mdi:pencil" height="auto" />
					<span>Edit</span>
				</button>
			</li>
			<li>
				<button
					class="text-error-400-500-token {popupMenuClasses}"
					on:click={() => onDeleteClick(m)}
				>
					<Icon icon="mdi:delete" height="auto" />
					<span>Delete</span>
				</button>
			</li>
		</ul>
		<div class="bg-surface-100-800-token arrow" />
	</div>
{/each}
