<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { submittingStore } from '$lib/stores';
	import { DeleteButton, HelperText, SubmitButton } from '$lib';

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
			<input type="hidden" name="id" value={$form.id} />
			<DeleteButton item="channel" disabled={$submitting} />
		{/if}
		<SubmitButton disabled={$submitting} />
	</div>
</form>
