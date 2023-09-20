<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { submittingStore } from '$lib/stores';

	export let data: PageData;
	const { form, message, errors, submitting, enhance, capture, restore } = superForm(data.form);
	export const snapshot = { capture, restore };

	$: $submittingStore = $submitting;
</script>

<main class="container mx-auto max-w-3xl flex-1">
	<h1 class="p-4 text-4xl font-semibold">外部サイトへのリンク{$form.id ? `更新` : `作成`}</h1>
	{#if $message}
		<span class="text-error-400-500-token">{$message}</span>
	{/if}
	<form class="space-y-8 p-4" method="POST" use:enhance>
		<input type="hidden" name="id" bind:value={$form.id} />
		<div>
			<label class="label">
				<span>Url</span>
				<input
					class="input"
					class:input-error={$errors.url || $message}
					type="text"
					name="url"
					bind:value={$form.url}
					disabled={$submitting}
					autocomplete="url"
				/>
			</label>
			{#if $errors.url}
				<span class="text-error-400-500-token">{$errors.url[0]}</span>
			{/if}
		</div>

		<div>
			<label class="label">
				<span>Title</span>
				<input
					class="input"
					class:input-error={$errors.title || $message}
					type="text"
					name="title"
					bind:value={$form.title}
					disabled={$submitting}
				/>
			</label>
			{#if $errors.title}
				<span class="text-error-400-500-token">{$errors.title[0]}</span>
			{/if}
		</div>

		<div>
			<label class="label">
				<span>Sort Order</span>
				<input
					class="input"
					class:input-error={$errors.sortOrder || $message}
					type="number"
					name="title"
					bind:value={$form.sortOrder}
					disabled={$submitting}
				/>
			</label>
			{#if $errors.sortOrder}
				<span class="text-error-400-500-token">{$errors.sortOrder[0]}</span>
			{/if}
		</div>

		<div class="flex justify-end">
			<button class="variant-filled-primary btn" disabled={$submitting}>保存</button>
		</div>
	</form>
</main>
