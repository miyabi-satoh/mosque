<script lang="ts">
	import { URLS } from '$lib/consts';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, errors, constraints, submitting, enhance, capture, restore } = superForm(
		data.form,
		{
			resetForm: true,
			taintedMessage: false
		}
	);
	export const snapshot = { capture, restore };
	$: $submittingStore = $submitting;
	type FormDataT = typeof $form;

	type SiteLinkT = PageData['siteLinks'][0];
	function handleClickEdit(siteLink: SiteLinkT) {
		$form = {
			...siteLink
		};
	}

	function handleClickCancel() {
		$form = {
			id: undefined,
			url: '',
			title: '',
			sortOrder: 0
		} satisfies FormDataT;
	}
	$: if ($form.url.length > 7 && !$form.title) fetchTitle();
	async function fetchTitle() {
		try {
			const url = encodeURIComponent($form.url);
			const res = await fetch(`${URLS.API_FETCH}${url}`);
			if (res.ok) {
				const html = await res.text();
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, 'text/html');
				console.log(doc.title);
				$form.title = doc.title;
			}
		} catch (e) {
			console.log(e);
		}
	}
</script>

<main class="container mx-auto flex-1 lg:max-w-3xl">
	<form method="POST" use:enhance>
		<input type="hidden" name="id" bind:value={$form.id} />
		<div class="border-surface-400-500-token mb-2 flex flex-col gap-4 border-b px-4 py-2">
			<div>
				<input
					class="input"
					class:input-error={$errors.url}
					type="text"
					name="url"
					title="Url"
					placeholder="Url"
					bind:value={$form.url}
					disabled={$submitting}
					autocomplete="url"
					{...$constraints.url}
				/>
				{#if $errors.url}
					<span class="text-error-400-500-token">{$errors.url[0]}</span>
				{/if}
			</div>
			{#if $form.url}
				<div class="flex gap-4">
					<div class="flex-1">
						<input
							class="input"
							class:input-error={$errors.title}
							type="text"
							name="title"
							title="Title"
							placeholder="Title"
							bind:value={$form.title}
							disabled={$submitting}
							{...$constraints.title}
						/>
						{#if $errors.title}
							<span class="text-error-400-500-token">{$errors.title[0]}</span>
						{/if}
					</div>
					<div>
						<input
							class="input w-20"
							class:input-error={$errors.sortOrder}
							type="number"
							title="sortOrder"
							name="sortOrder"
							bind:value={$form.sortOrder}
							disabled={$submitting}
							{...$constraints.sortOrder}
						/>
						{#if $errors.sortOrder}
							<span class="text-error-400-500-token">{$errors.sortOrder[0]}</span>
						{/if}
					</div>
				</div>

				<div class="flex justify-end gap-x-4">
					{#if $form.id}
						<button class="variant-filled btn" on:click|preventDefault={handleClickCancel}
							>キャンセル</button
						>
						<button
							name="delete"
							on:click={(e) => !confirm('削除しますか？') && e.preventDefault()}
							class="variant-ghost-error btn"
							disabled={$submitting}
						>
							削除
						</button>
					{/if}
					<button class="variant-ghost-primary btn" disabled={$submitting}>保存</button>
				</div>
			{/if}
		</div>
	</form>
	<div class="flex flex-col gap-4 p-4">
		{#each data.siteLinks as siteLink (siteLink.id)}
			<div class="flex items-center gap-4">
				<span>
					{siteLink.sortOrder} -
					<a class="anchor" href={siteLink.url}>{siteLink.title}</a>
				</span>
				<button class="variant-filled btn btn-sm" on:click={() => handleClickEdit(siteLink)}
					>編集</button
				>
			</div>
		{/each}
	</div>
</main>
