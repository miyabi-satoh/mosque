<script lang="ts">
	import { page } from '$app/stores';
	import { DeleteButton, FormLabel, HelperText, SubmitButton } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	export let data: PageData;

	const { form, errors, constraints, enhance, message, submitting } = superForm(data.form, {
		resetForm: $page.params.id === 'new'
	});
	$: $submittingStore = $submitting;
</script>

<form class="mx-4 space-y-4" method="post" use:enhance>
	{#if $message}
		<HelperText usePageStatus>{$message}</HelperText>
	{/if}
	<input type="hidden" name="id" bind:value={$form.id} />
	<div>
		<FormLabel text="Title" constraint={$constraints.title}>
			<input
				class="input"
				class:input-error={$errors.title}
				type="text"
				name="title"
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
		<FormLabel text="Path" constraint={$constraints.path}>
			<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
				<div class="input-group-shim">{$page.url.origin}/archives/</div>
				<input
					class="input"
					class:input-error={$errors.path}
					type="text"
					name="path"
					bind:value={$form.path}
					disabled={$submitting}
					{...$constraints.path}
				/>
			</div>
		</FormLabel>
		<HelperText>
			{$errors.path ? $errors.path[0] : ''}
		</HelperText>
	</div>
	<div>
		<FormLabel text="Root" constraint={$constraints.root}>
			<input
				class="input"
				class:input-error={$errors.root}
				type="text"
				name="root"
				bind:value={$form.root}
				disabled={$submitting}
				{...$constraints.root}
			/>
		</FormLabel>
		<HelperText>
			{$errors.root ? $errors.root[0] : ''}
		</HelperText>
	</div>
	<div>
		<FormLabel text="Depth" constraint={$constraints.depth}>
			<input
				class="input"
				class:input-error={$errors.depth}
				type="number"
				name="depth"
				min={1}
				max={9}
				bind:value={$form.depth}
				disabled={$submitting}
				{...$constraints.depth}
			/>
		</FormLabel>
		<HelperText>
			{$errors.depth ? $errors.depth[0] : ''}
		</HelperText>
	</div>
	<div class="flex items-center justify-end pt-4">
		<div class:hidden={$page.params.id === 'new'} class="flex-1">
			<DeleteButton />
		</div>
		<SubmitButton />
	</div>
</form>
