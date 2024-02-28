<script lang="ts">
	import { page } from '$app/stores';
	import { DeleteButton, FormLabel, HelperText, SubmitButton } from '$lib';
	import { URLS } from '$lib/consts';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, errors, constraints, enhance, message, submitting } = superForm(data.form, {
		resetForm: $page.params.id === 'new'
	});
	$: $submittingStore = $submitting;

	let hasTitleFocus: boolean = false;

	$: if ($form.url.match(/^https?:\/\/[^/]/) && !$form.title) fetchTitle();

	async function fetchTitle(): Promise<void> {
		try {
			const url = encodeURIComponent($form.url);
			const res = await fetch(URLS.API_FETCH(url));
			if (res.ok) {
				const html = await res.text();
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, 'text/html');
				if (!hasTitleFocus) $form.title = doc.title;
			}
		} catch (e) {
			console.error(e);
		}
	}
</script>

<form class="mx-4 space-y-4" method="post" use:enhance>
	{#if $message}
		<HelperText usePageStatus>{$message}</HelperText>
	{/if}
	<input type="hidden" name="id" bind:value={$form.id} />
	<div>
		<FormLabel text="Url" constraint={$constraints.url}>
			<input
				class="input"
				class:input-error={$errors.url}
				type="text"
				name="url"
				bind:value={$form.url}
				disabled={$submitting}
				{...$constraints.url}
			/>
		</FormLabel>
		<HelperText>
			{$errors.url ? $errors.url[0] : ''}
		</HelperText>
	</div>
	<div>
		<FormLabel text="Title" constraint={$constraints.title}>
			<input
				placeholder="Automatically set from URL"
				class="input"
				class:input-error={$errors.title}
				type="text"
				name="title"
				on:focus={() => (hasTitleFocus = true)}
				on:blur={() => (hasTitleFocus = false)}
				bind:value={$form.title}
				disabled={$submitting}
				{...$constraints.title}
			/>
		</FormLabel>
		<HelperText>
			{$errors.title ? $errors.title[0] : ''}
		</HelperText>
	</div>
	<div>
		<FormLabel text="Description" constraint={$constraints.description}>
			<textarea
				class="textarea"
				class:input-error={$errors.description}
				name="description"
				bind:value={$form.description}
				disabled={$submitting}
				{...$constraints.description}
			/>
		</FormLabel>
		<HelperText>
			{$errors.description ? $errors.description[0] : ''}
		</HelperText>
	</div>
	<div class="flex items-center justify-end pt-4">
		<div class:hidden={$page.params.id === 'new'} class="flex-1">
			<DeleteButton />
		</div>
		<SubmitButton />
	</div>
</form>
