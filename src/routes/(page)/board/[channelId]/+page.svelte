<script lang="ts">
	import { URLS } from '$lib/consts';
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { Scrollable } from '$lib';
	import {
		popup,
		type ModalComponent,
		type ModalSettings,
		getModalStore
	} from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
	import { submittingStore } from '$lib/stores';
	import { formatRelative } from 'date-fns';
	import ja from 'date-fns/locale/ja';
	import { tick } from 'svelte';
	import UserAvatar from '$lib/components/UserAvatar.svelte';
	import EditModal from './EditModal.svelte';
	import { autoResize, autoResizeTextarea } from '$lib/actions/autoResizeTextarea';
	import type { ScrollBehavior } from '$lib/types';
	import { marked } from 'marked';
	import './style.postcss';

	export let data: PageData;
	const { form, message, errors, submitting, constraints, enhance } = superForm(data.form, {
		onUpdated: ({ form }) => {
			console.log('onUpdated', form);
			if (form.valid) {
				if (!form.data.id) scrollBehavior = 'smooth';
				autoResizeTextarea(elemTextarea);
			}
		}
	});
	$: $submittingStore = $submitting;

	const popupMenuClasses = 'flex w-full gap-x-2 rounded px-4 py-2 hover:bg-primary-500/10';

	function showRelativeDate(date: Date): string {
		return formatRelative(date, new Date(), { locale: ja });
	}

	const modalStore = getModalStore();
	type Message = PageData['messages'][0];

	let formEdit: Message | undefined;
	let elemForm: HTMLFormElement;
	const formEditId = 'form-edit';
	function onEditClick(objMessage: Message): void {
		const component: ModalComponent = { ref: EditModal };
		const modal: ModalSettings = {
			type: 'component',
			component,
			meta: {
				message: objMessage.message
			},
			response: async (r: string) => {
				if (r) {
					formEdit = {
						...objMessage,
						message: r
					};
					await tick();
					elemForm.submit();
				}
			}
		};
		modalStore.trigger(modal);
	}

	let scrollBehavior: ScrollBehavior = 'auto';
	let elemTextarea: HTMLTextAreaElement;
</script>

<form method="post" id={formEditId} bind:this={elemForm} use:enhance>
	<input type="hidden" name="id" value={formEdit?.id} />
	<input type="hidden" name="message" value={formEdit?.message} />
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
						{#if m.userId === data.user?.userId}
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
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<article class="marked">{@html marked.parse(m.message)}</article>
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
		<form class="mx-4" method="post" use:enhance>
			<div class="flex items-end gap-2">
				<textarea
					class="textarea max-h-96 resize-none overflow-y-auto text-sm"
					name="message"
					rows="1"
					placeholder="Message #{data.channel.name}"
					class:input-error={$errors.message}
					bind:value={$form.message}
					bind:this={elemTextarea}
					use:autoResize
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
				<button class="text-error-400-500-token {popupMenuClasses}">
					<Icon icon="mdi:delete" height="auto" />
					<span>Delete</span>
				</button>
			</li>
		</ul>
		<div class="bg-surface-100-800-token arrow" />
	</div>
{/each}
