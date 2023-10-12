<script lang="ts">
	import { HelperText, ModalContainer } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { focusTrap } from '@skeletonlabs/skeleton';

	export let data: PageData;
	const { form, message, constraints, errors, submitting, enhance } = superForm(data.form);
	$: $submittingStore = $submitting;

	let isFocused: boolean = true;
	const title = data.breadcrumbs.slice(-1)[0].label;
</script>

<ModalContainer {title}>
	<form method="POST" class="space-y-4" use:enhance use:focusTrap={isFocused}>
		<HelperText class="text-center" usePageStatus>{$message ?? ''}</HelperText>
		<div>
			<input
				class="input"
				class:input-error={$errors.password}
				type="password"
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

		<div>
			<input
				class="input"
				class:input-error={$errors.newPassword}
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

		<div>
			<input
				class="input"
				class:input-error={$errors.confirmPassword}
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

		<button type="submit" class="variant-ghost-primary btn w-full" disabled={$submitting}
			>Submit</button
		>
	</form>
</ModalContainer>
