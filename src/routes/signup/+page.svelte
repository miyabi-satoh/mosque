<script lang="ts">
	import { MainContainer } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, message, errors, submitting, enhance } = superForm(data.form, {
		resetForm: true,
		taintedMessage: false
	});
	$: $submittingStore = $submitting;
</script>

<MainContainer>
	<div class="w-modal-slim mx-auto rounded-md p-6 shadow-2xl">
		<h1 class="h1 text-center">サインアップ</h1>
		<form method="POST" use:enhance>
			<div class="my-2">
				<label class="label">
					<span>ログインID</span>
					<input
						class="input"
						class:input-error={$errors.username || $message}
						type="text"
						id="username"
						name="username"
						bind:value={$form.username}
						disabled={$submitting}
						autocomplete="username"
					/>
				</label>
				{#if $errors.username}
					<span class="text-error-400-500-token">{$errors.username[0]}</span>
				{/if}
			</div>

			<div class="my-2">
				<label class="label">
					<span>パスワード</span>
					<input
						class="input"
						class:input-error={$errors.password || $message}
						type="password"
						id="password"
						name="password"
						bind:value={$form.password}
						disabled={$submitting}
						autocomplete="new-password"
					/>
				</label>
				{#if $errors.password}
					<span class="text-error-400-500-token">{$errors.password[0]}</span>
				{/if}
			</div>

			<div class="my-2">
				<label class="label">
					<span class="label-text">パスワード（確認）</span>
					<input
						class="input"
						class:input-error={$errors.confirmPassword || $message}
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						bind:value={$form.confirmPassword}
						disabled={$submitting}
						autocomplete="new-password"
					/>
				</label>
				{#if $errors.confirmPassword}
					<span class="text-error-400-500-token">{$errors.confirmPassword[0]}</span>
				{/if}
			</div>

			<div class="my-4">
				<button class="variant-filled btn w-full" disabled={$submitting}>サインアップ</button>
			</div>
		</form>
		{#if $message}
			<div class="text-error-400-500-token">{$message}</div>
		{/if}
	</div>
</MainContainer>
