<script lang="ts">
	import { browser } from '$app/environment';
	import { HelperText, Scrollable } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { formatDistanceToNow } from 'date-fns';
	import ja from 'date-fns/locale/ja';
	import { onMount, tick } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

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

	function handleBlurTextarea() {
		console.log(`handleBlurTextarea`);
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

	function handleClickCancel() {
		$form = {
			id: undefined,
			name: '',
			description: '',
			private: false,
			delete: false
		} satisfies FormDataT;
		// currentPost = undefined;
	}

	async function handleClickEdit(post: Channel) {
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

	function handleClickDelete(post: Channel) {
		// currentPost = post;
		$form = {
			...post,
			delete: true
		};
	}

	function formatDate(date: Date) {
		return formatDistanceToNow(date, { locale: ja, addSuffix: true });
	}

	async function handleResize() {
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
			handleResize();
		}
	});
</script>

<svelte:window on:resize={handleResize} />
{#if data.user}
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
				on:blur={handleBlurTextarea}
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
					<button class="variant-filled btn" on:click|preventDefault={handleClickCancel}
						>Cancel</button
					>
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
							<button class="variant-filled-primary btn" on:click={() => handleClickEdit(channel)}
								>Edit</button
							>
							<button class="variant-filled-error btn" on:click={() => handleClickDelete(channel)}
								>Delete</button
							>
						</div>
					</svelte:fragment>
				</AccordionItem>
			{/each}
		</Accordion>
	{:else}
		No items.
	{/if}
</Scrollable>
