<script lang="ts">
	import { HelperText, ModalContainer, SubmitButton } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { focusTrap } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';

	export let data: PageData;
	const { form, message, errors, submitting, enhance } = superForm(data.form);
	$: $submittingStore = $submitting;

	let isFocused: boolean = true;
</script>

<ModalContainer title="Login to Your MOSQUE Account">
	<form method="POST" class="space-y-4" use:enhance use:focusTrap={isFocused}>
		<HelperText class="text-center" usePageStatus>
			{$message ?? ''}
		</HelperText>
		<div>
			<div class="input-group input-group-divider grid-cols-[auto_1fr]">
				<div class="input-group-shim">
					<Icon icon="mdi:account" height="auto" />
				</div>
				<input
					class:input-error={$errors.username || $message}
					type="text"
					name="username"
					placeholder="Login ID"
					bind:value={$form.username}
					disabled={$submitting}
					autocomplete="username"
				/>
			</div>
			<HelperText>
				{$errors.username ? $errors.username[0] : ''}
			</HelperText>
		</div>

		<div>
			<div class="input-group input-group-divider grid-cols-[auto_1fr]">
				<div class="input-group-shim">
					<Icon icon="mdi:lock" height="auto" />
				</div>
				<input
					class:input-error={$errors.password || $message}
					type="password"
					name="password"
					placeholder="Password"
					bind:value={$form.password}
					disabled={$submitting}
					autocomplete="current-password"
				/>
			</div>
			<HelperText>
				{$errors.password ? $errors.password[0] : ''}
			</HelperText>
		</div>

		<SubmitButton class="w-full" disabled={$submitting}>
			<span><Icon icon="mdi:login" height="auto" /></span>
			<span>LOGIN</span>
		</SubmitButton>
	</form>
</ModalContainer>
