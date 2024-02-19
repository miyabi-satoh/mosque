<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { FormLabel, HelperText } from '$lib';
	import { page } from '$app/stores';

	export let data: PageData;

	const { form, errors, constraints, enhance, message, submitting } = superForm(data.form);

	console.log($page.url);
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
</form>
