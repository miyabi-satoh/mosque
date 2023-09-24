<script lang="ts">
	import { MainContainer } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, message, errors, submitting, enhance, capture, restore } = superForm(data.form, {
		resetForm: true,
		taintedMessage: false
	});
	export const snapshot = { capture, restore };
	$: $submittingStore = $submitting;
</script>

<MainContainer>
	<div class="w-modal-slim mx-auto rounded-md p-6 shadow-2xl">
		<h1 class="text-center text-3xl font-semibold">ログイン</h1>
		{#if $message}
			<span class="text-error-400-500-token">{$message}</span>
		{/if}
		<form class="space-y-8" method="POST" use:enhance>
			<div>
				<label class="label">
					<span>ユーザー名</span>
					<input
						class="input"
						class:input-error={$errors.username || $message}
						type="text"
						name="username"
						id="username"
						bind:value={$form.username}
						disabled={$submitting}
						autocomplete="username"
					/>
				</label>
				{#if $errors.username}
					<span class="text-error-400-500-token"> {$errors.username[0]}</span>
				{/if}
			</div>

			<div>
				<label class="label">
					<span>パスワード</span>
					<input
						class="input"
						class:input-error={$errors.password || $message}
						type="password"
						name="password"
						id="password"
						bind:value={$form.password}
						disabled={$submitting}
						autocomplete="current-password"
					/>
				</label>
				{#if $errors.password}
					<span class="text-error-400-500-token">{$errors.password[0]}</span>
				{/if}
			</div>

			<button class="variant-filled btn w-full" disabled={$submitting}>ログイン</button>
		</form>
	</div>
</MainContainer>
