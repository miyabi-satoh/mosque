<script lang="ts">
	import { HelperText, MainContainer } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, message, constraints, errors, submitting, enhance } = superForm(data.form, {
		resetForm: true,
		taintedMessage: false
	});
	$: $submittingStore = $submitting;
</script>

<MainContainer>
	<div class="border-surface-200-700-token w-modal-slim mx-auto rounded-3xl border p-6 shadow-2xl">
		<h1 class="h1 text-center">Login</h1>
		<HelperText class="my-4 text-center">
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
					{...$constraints.username}
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
					{...$constraints.password}
				/>
				<HelperText>
					{$errors.password ? $errors.password[0] : ''}
				</HelperText>
			</div>

			<div class="my-4">
				<button class="variant-ghost-primary btn w-full" disabled={$submitting}>Submit</button>
			</div>
		</form>
	</div>
</MainContainer>
