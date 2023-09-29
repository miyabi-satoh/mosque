<script lang="ts">
	import { HelperText, MainContainer, ModalContainer } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from '../$types';

	export let data: PageData;
	const { form, message, constraints, errors, submitting, enhance } = superForm(data.form, {
		resetForm: true,
		taintedMessage: false
	});
	$: $submittingStore = $submitting;
</script>

<MainContainer>
	<ModalContainer title="Change password">
		<HelperText class="my-4 text-center">
			{$message ?? ''}
		</HelperText>

		<form method="POST" use:enhance>
			<div class="my-4">
				<input
					class="input"
					class:input-error={$errors.password || $message}
					type="text"
					name="password"
					id="password"
					placeholder="Enter your current password"
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
				<input
					class="input"
					class:input-error={$errors.newPassword || $message}
					type="password"
					name="newPassword"
					id="newPassword"
					placeholder="Enter your new password"
					bind:value={$form.newPassword}
					disabled={$submitting}
					{...$constraints.newPassword}
				/>
				<HelperText>
					{$errors.newPassword ? $errors.newPassword[0] : ''}
				</HelperText>
			</div>

			<div class="my-4">
				<input
					class="input"
					class:input-error={$errors.confirmPassword || $message}
					type="password"
					name="confirmPassword"
					id="confirmPassword"
					placeholder="Confirm your new password"
					bind:value={$form.confirmPassword}
					disabled={$submitting}
					{...$constraints.confirmPassword}
				/>
				<HelperText>
					{$errors.confirmPassword ? $errors.confirmPassword[0] : ''}
				</HelperText>
			</div>

			<div class="my-4">
				<button class="variant-ghost-primary btn w-full" disabled={$submitting}>Submit</button>
			</div>
		</form>
	</ModalContainer>
</MainContainer>
