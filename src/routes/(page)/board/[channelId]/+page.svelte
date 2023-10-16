<script lang="ts">
	import { DeleteButton, Scrollable, UserAvatar } from '$lib';
	import { URLS } from '$lib/consts';
	import { submittingStore } from '$lib/stores';
	import type { ScrollBehavior } from '$lib/types';
	import Icon from '@iconify/svelte';
	import {
		getModalStore,
		popup,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import { formatRelative } from 'date-fns';
	import ja from 'date-fns/locale/ja';
	import { marked } from 'marked';
	import { tick } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import './style.postcss';
	import { hasAdminRole } from '$lib/utils';
	import EditModal from './EditModal.svelte';
	import DOMPurify from 'dompurify';
	import { browser } from '$app/environment';

	marked.use({
		breaks: true
	});

	const postCreateButtonId = 'button-post-create';
	const postUpdateButtonId = 'button-post-update';
	const postDeleteButtonId = 'button-post-delete';
	const popupMenuClasses = 'flex w-full gap-x-2 rounded px-4 py-2 hover:bg-primary-500/10';

	export let data: PageData;
	const { form, message, submitting, enhance } = superForm(data.form, {
		onUpdated: ({ form }) => {
			if (form.valid) {
				if (!form.data.id) scrollBehavior = 'smooth';
			}
		}
	});
	$: $submittingStore = $submitting;

	function showRelativeDate(date: Date): string {
		return formatRelative(date, new Date(), { locale: ja });
	}

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
</script>

<form class="contents" method="post" use:enhance>
	<input type="hidden" name="id" value={formData?.id} />
	<input type="hidden" name="message" value={formData?.message} />
	<button id={postUpdateButtonId} class="hidden" />
	<DeleteButton id={postDeleteButtonId} class="hidden" />
</form>

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
	<Scrollable class="space-y-4 px-4" bind:behavior={scrollBehavior}>
		{#each data.messages as m, i (m.id)}
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
						{#if m.userId === data.user?.userId || hasAdminRole(data.user)}
							<div>
								<button
									use:popup={{
										event: 'click',
										target: `popupClick-${i}`,
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
							{@html DOMPurify.sanitize(marked.parse(m.message))}
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
	</Scrollable>
	{#if data.user}
		<hr />
		<form class="mx-4" method="post" use:enhance>
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
				<button id={postCreateButtonId} class="variant-ghost-primary btn" disabled={$submitting}>
					<span><Icon icon="mdi:send" height="auto" /></span>
					<span class="hidden sm:block">Send</span>
				</button>
			</div>
		</form>
	{/if}
</div>
{#each data.messages as m, i}
	<div class="card w-48 p-2 shadow-xl" data-popup="popupClick-{i}">
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
