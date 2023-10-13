<script lang="ts">
	import { browser } from '$app/environment';
	import { submittingStore } from '$lib/stores';
	import { formatDistanceToNow, formatRelative } from 'date-fns';
	import ja from 'date-fns/locale/ja';
	import { onMount, tick } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';
	import { URLS } from '$lib/consts';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { UserAvatar } from '$lib';

	export let data: PageData;
	type Channel = PageData['channels'][0];

	const { form, errors, constraints, submitting, enhance } = superForm(data.form);
	$: $submittingStore = $submitting;
	type FormDataT = typeof $form;

	// const popupHover: PopupSettings = {
	// 	event: 'hover',
	// 	target: 'popupHover',
	// 	placement: 'top'
	// };

	let focusOnTextarea = false;
	// let currentPost: Channel | undefined = undefined;
	let textareaRows = 1;

	function calcRows(focus: boolean, content: string) {
		if (focus || content) {
			const rows = ((content: string) => {
				if (!content) {
					return 0;
				}
				const rows = (content.match(/\n/g) ?? []).length;
				// 改行だけでなく、折り返しの行数も考慮
				const e = window.document.getElementById('form-content')!;
				const fontSize =
					parseInt(
						window.getComputedStyle(e, null).getPropertyValue('font-size').replace('px', ''),
						10
					) + 1;
				const width = e.clientWidth;
				const wordsPerLine = width / fontSize;
				const lines = content.length / wordsPerLine;
				return Math.max(lines, rows);
			})(content);
			console.log(`calcRows`, rows, focus, content);

			return Math.floor(Math.min(rows + 1, 20));
		}
		return 1;
	}

	function onTextareaBlur() {
		focusOnTextarea = false;
		const content = $form.name.replace(/\n{2,}/g, '\n').trim();
		textareaRows = calcRows(focusOnTextarea, content);
		$form.name = content;
	}

	// テキストエリアでの入力時に行数を調整する
	$: if (focusOnTextarea) {
		textareaRows = calcRows(focusOnTextarea, $form.name);
	}
	// テキストエリアをクリアしたら、行数を1にする
	$: if ($form.name.length === 0) {
		textareaRows = 1;
	}

	function onCancelClick() {
		$form = {
			id: undefined,
			name: '',
			description: '',
			private: false,
			delete: false
		} satisfies FormDataT;
		// currentPost = undefined;
	}

	async function onEditClick(post: Channel) {
		// currentPost = post;
		$form = {
			...post,
			delete: false
		};
		await tick();
		const el = window.document.getElementById('form-content');
		if (el) {
			const e = el as HTMLTextAreaElement;
			e.selectionStart = 0;
			e.focus();
		}
		textareaRows = calcRows(true, post.name);
	}

	function onDeleteClick(post: Channel) {
		// currentPost = post;
		$form = {
			...post,
			delete: true
		};
	}

	function formatDate(date: Date) {
		return formatDistanceToNow(date, { locale: ja, addSuffix: true });
	}

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
		<input type="text" class="input" id="search" placeholder="Find a channel..." />
		<a href="/board/channel" class="variant-ghost-primary btn">
			<span><Icon icon="mdi:rss" height="auto" /></span>
			<span>New</span>
		</a>
	</div>
	{#if data.channels.length > 0}
		<div class="mx-4 space-y-4">
			{#each data.channels as channel}
				<a href="{URLS.BOARD}/{channel.id}" class="block">
					<div class="card card-hover space-y-2 px-4 py-2">
						<div class="flex gap-x-4">
							<h1 class="h5 flex-1 font-semibold sm:h3"># {channel.name}</h1>
							{#if channel.lastMessage}
								<div class="text-sm opacity-50">
									{formatRelative(channel.lastMessage.updatedAt, new Date(), { locale: ja })}
								</div>
							{/if}
						</div>
						<div class="flex gap-x-4 opacity-75">
							{#if channel.lastMessage}
								<div>
									<UserAvatar src={channel.lastMessage.user.avatar} />
								</div>
								<div>
									<span class="text-sm font-semibold sm:text-base">
										{channel.lastMessage.user.displayName ?? channel.lastMessage.user.fullName}
									</span>
									<p class="line-clamp-2 text-xs sm:text-sm">{channel.lastMessage.message}</p>
								</div>
							{:else}
								<p class="text-xs sm:text-sm">No messages found on this channel.</p>
							{/if}
						</div>
					</div>
				</a>
			{/each}
		</div>
	{:else}
		<div class="mx-4">No channels.</div>
	{/if}
</div>
<!-- {#if data.user}
	<form method="POST" class="mx-4 mb-4" use:enhance>
		<input type="hidden" name="id" value={$form.id} />
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<textarea
				class="textarea sm:col-span-2"
				class:input-error={$errors.name}
				name="content"
				id="form-content"
				rows={textareaRows}
				placeholder="Message"
				bind:value={$form.name}
				on:focus={() => (focusOnTextarea = true)}
				on:blur={onTextareaBlur}
				{...$constraints.name}
			/>

			{#if $form.name}
				<div class="sm:col-span-2">
					<label class="label">
						<input
							class="input"
							class:input-error={$errors.description}
							type="text"
							name="title"
							placeholder="Title"
							bind:value={$form.description}
							{...$constraints.description}
						/>
					</label>
					<HelperText>{$errors.description ? $errors.description[0] : ''}</HelperText>
				</div>
				<div class="mb-1 flex justify-end gap-x-4 sm:col-span-2">
					<button class="variant-filled btn" on:click|preventDefault={onCancelClick}>Cancel</button>
					<button class="variant-filled-primary btn">Save</button>
				</div>
			{/if}
		</div>
	</form>
{/if}
<Scrollable class="mx-4">
	{#if data.channels.length > 0}
		<Accordion>
			{#each data.channels as channel (channel.id)}
				<AccordionItem>
					<svelte:fragment slot="summary">
						<div class="flex items-baseline gap-x-4">
							<h1 class="text-lg font-bold">{channel.name}</h1>
							<span class="text-surface-500-400-token text-sm">
								{channel.updatedBy}・{formatDate(channel.updatedAt)}
							</span>
							<div
								class="text-surface-500-400-token flex-1 truncate text-sm"
								data-content={channel.description}
							/>
						</div>
					</svelte:fragment>
					<svelte:fragment slot="content">
						<p class="pl-2">
							{channel.description}
						</p>
						<div class="flex justify-end gap-x-4">
							<button class="variant-filled-primary btn" on:click={() => onEditClick(channel)}
								>Edit</button
							>
							<button class="variant-filled-error btn" on:click={() => onDeleteClick(channel)}
								>Delete</button
							>
						</div>
					</svelte:fragment>
				</AccordionItem>
			{/each}
		</Accordion>
	{:else}
		No channels.
	{/if}
</Scrollable> -->
