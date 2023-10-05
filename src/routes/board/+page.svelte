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
	type Post = PageData['posts'][0];

	const { form, errors, constraints, submitting, enhance } = superForm(data.form);
	$: $submittingStore = $submitting;
	type FormDataT = typeof $form;

	// const popupHover: PopupSettings = {
	// 	event: 'hover',
	// 	target: 'popupHover',
	// 	placement: 'top'
	// };

	let focusOnTextarea = false;
	let currentPost: Post | undefined = undefined;
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
		const content = $form.content.replace(/\n{2,}/g, '\n').trim();
		textareaRows = calcRows(focusOnTextarea, content);
		$form.content = content;
	}

	// テキストエリアでの入力時に行数を調整する
	$: if (focusOnTextarea) {
		textareaRows = calcRows(focusOnTextarea, $form.content);
	}
	// テキストエリアをクリアしたら、行数を1にする
	$: if ($form.content.length === 0) {
		textareaRows = 1;
	}

	function handleClickCancel() {
		$form = {
			id: undefined,
			content: '',
			title: '',
			password: '',
			username: '',
			delete: undefined
		} satisfies FormDataT;
		currentPost = undefined;
	}

	async function handleClickEdit(post: Post) {
		currentPost = post;
		$form = {
			...post,
			password: ''
		};
		await tick();
		const el = window.document.getElementById('form-content');
		if (el) {
			const e = el as HTMLTextAreaElement;
			e.selectionStart = 0;
			e.focus();
		}
		textareaRows = calcRows(true, post.content);
	}

	function handleClickDelete(post: Post) {
		currentPost = post;
		$form = {
			...post,
			password: '',
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
				class:input-error={$errors.content}
				name="content"
				id="form-content"
				rows={textareaRows}
				placeholder="Message"
				bind:value={$form.content}
				on:focus={() => (focusOnTextarea = true)}
				on:blur={handleBlurTextarea}
				{...$constraints.content}
			/>

			{#if $form.content}
				<div class="sm:col-span-2">
					<label class="label">
						<input
							class="input"
							class:input-error={$errors.title}
							type="text"
							name="title"
							placeholder="Title"
							bind:value={$form.title}
							{...$constraints.title}
						/>
					</label>
					<HelperText>{$errors.title ? $errors.title[0] : ''}</HelperText>
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
	{#if data.posts.length > 0}
		<Accordion>
			{#each data.posts as post (post.id)}
				<AccordionItem>
					<svelte:fragment slot="summary">
						<div class="flex items-baseline gap-x-4">
							<h1 class="text-lg font-bold">{post.title}</h1>
							<span class="text-surface-500-400-token text-sm">
								{post.username}・{formatDate(post.updatedAt)}
							</span>
							<div
								class="text-surface-500-400-token flex-1 truncate text-sm"
								data-content={post.content}
							/>
						</div>
					</svelte:fragment>
					<svelte:fragment slot="content">
						<p class="pl-2">
							{post.content}
						</p>
						{#if post.password && !$form.id}
							<div class="flex justify-end gap-x-4">
								<button class="variant-filled-primary btn" on:click={() => handleClickEdit(post)}
									>Edit</button
								>
								<button class="variant-filled-error btn" on:click={() => handleClickDelete(post)}
									>Delete</button
								>
							</div>
						{/if}
					</svelte:fragment>
				</AccordionItem>
			{/each}
		</Accordion>
	{:else}
		No items.
	{/if}
</Scrollable>
