<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { submittingStore } from '$lib/stores';
	import { HelperText } from '$lib';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	export let data: PageData;
	const { form, message, errors, submitting, constraints, enhance } = superForm(data.form);
	$: $submittingStore = $submitting;
</script>

<form class="mx-4 space-y-4" method="post" use:enhance>
	{#if $message}
		<HelperText usePageStatus>{$message}</HelperText>
	{/if}
	<div>
		<label class="label">
			<span>Channel name</span>
			<input
				class="input"
				type="text"
				name="name"
				class:input-error={$errors.name}
				bind:value={$form.name}
				disabled={$submitting}
				{...$constraints.name}
			/>
		</label>
		<HelperText>
			{$errors.name ? $errors.name[0] : ''}
		</HelperText>
	</div>
	<div>
		<label class="label">
			<span>Description</span>
			<textarea
				class="textarea"
				name="description"
				class:input-error={$errors.description}
				bind:value={$form.description}
				disabled={$submitting}
			/>
		</label>
		<HelperText>
			{$errors.description ? $errors.description[0] : ''}
		</HelperText>
	</div>
	<!-- <SlideToggle name="private" bind:checked={$form.private}>Private</SlideToggle> -->
	<div class="flex justify-end gap-x-2">
		{#if $form.id}
			<button type="button" name="delete" class="variant-ghost-warning btn" disabled={$submitting}>
				Delete channel
			</button>
		{/if}
		<button class="variant-ghost-primary btn" disabled={$submitting}>
			{$form.id ? 'Save' : 'Create'} channel
		</button>
	</div>
	<input type="hidden" name="id" value={$form.id} />
</form>
