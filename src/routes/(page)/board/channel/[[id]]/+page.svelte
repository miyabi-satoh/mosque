<script lang="ts">
	import { DeleteButton, FormLabel, HelperText, SubmitButton } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, message, errors, submitting, constraints, enhance } = superForm(data.form);
	$: $submittingStore = $submitting;
</script>

<form class="mx-4 space-y-4" method="post" use:enhance>
	{#if $message}
		<HelperText usePageStatus>{$message}</HelperText>
	{/if}
	<div>
		<FormLabel text="Channel name" constraint={$constraints.name}>
			<input
				class="input"
				class:input-error={$errors.name}
				type="text"
				name="name"
				bind:value={$form.name}
				disabled={$submitting}
				{...$constraints.name}
			/>
		</FormLabel>
		<HelperText>
			{$errors.name ? $errors.name[0] : ''}
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
	<!-- <SlideToggle name="private" bind:checked={$form.private}>Private</SlideToggle> -->
	<div class="flex justify-end gap-x-2">
		{#if $form.id}
			<input type="hidden" name="id" value={$form.id} />
			<DeleteButton item="channel" disabled={$submitting} />
		{/if}
		<SubmitButton disabled={$submitting} />
	</div>
</form>
