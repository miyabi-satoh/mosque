<script lang="ts">
	import { HelperText, ModalContainer } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, message, errors, submitting, enhance } = superForm(data.form, {
		taintedMessage: false
	});
	$: $submittingStore = $submitting;
</script>

<ModalContainer title="Login">
	<HelperText class="my-4 text-center" usePageStatus>
		{$message ?? ''}
	</HelperText>

	<form method="POST" use:enhance>
		<div class="my-4">
			<input
				class="input"
				class:input-error={$errors.username || $message}
				type="text"
				name="username"
				id="username"
				placeholder="Enter your login ID"
				bind:value={$form.username}
				disabled={$submitting}
				autocomplete="username"
			/>
			<HelperText>
				{$errors.username ? $errors.username[0] : ''}
			</HelperText>
		</div>

		<div class="my-4">
			<input
				class="input"
				class:input-error={$errors.password || $message}
				type="password"
				name="password"
				id="password"
				placeholder="Enter your password"
				bind:value={$form.password}
				disabled={$submitting}
				autocomplete="current-password"
			/>
			<HelperText>
				{$errors.password ? $errors.password[0] : ''}
			</HelperText>
		</div>

		<div class="my-4">
			<button class="variant-ghost-primary btn w-full" disabled={$submitting}>Submit</button>
		</div>
	</form>
</ModalContainer>
