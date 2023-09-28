<script lang="ts">
	import { MainContainer } from '$lib';
	import HelperText from '$lib/components/HelperText.svelte';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, message, errors, submitting, enhance } = superForm(data.form, {
		taintedMessage: false
	});
	$: $submittingStore = $submitting;
</script>

<MainContainer>
	<form class="p-4" method="post" use:enhance>
		<HelperText class="my-2" usePageStatus>
			{$message ?? ''}
		</HelperText>
		<div class="my-2">
			<label class="label">
				<span>Login ID</span>
				<input
					class="input"
					class:input-error={$errors.username}
					type="text"
					id="username"
					name="username"
					bind:value={$form.username}
					disabled={$submitting}
					autocomplete="username"
				/>
			</label>
			<HelperText>
				{$errors.username ? $errors.username[0] : ''}
			</HelperText>
		</div>

		<div class="my-2">
			<label class="label">
				<span>Display Name</span>
				<input
					class="input"
					class:input-error={$errors.displayName}
					type="text"
					id="displayName"
					name="displayName"
					bind:value={$form.displayName}
					disabled={$submitting}
				/>
			</label>
			<HelperText>
				{$errors.displayName ? $errors.displayName[0] : ''}
			</HelperText>
		</div>

		<div class="my-2">
			<label class="label">
				<span>Enter your password to save</span>
				<input
					class="input"
					class:input-error={$errors.password}
					type="password"
					id="password"
					name="password"
					bind:value={$form.password}
					disabled={$submitting}
				/>
			</label>
			<HelperText>
				{$errors.password ? $errors.password[0] : ''}
			</HelperText>
		</div>

		<div class="my-8 flex justify-end">
			<button class="variant-ghost-primary btn">Save</button>
		</div>
	</form>
</MainContainer>
