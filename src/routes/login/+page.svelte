<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';

	export let data: PageData;
	const { form, message, errors, submitting, capture, restore, enhance } = superForm(data.form, {
		taintedMessage: false
	});
	export const snapshot = { capture, restore };
</script>

<div class="mx-auto w-full max-w-lg rounded-md p-6 shadow-2xl">
	<h1 class="text-center text-3xl font-semibold">ログイン</h1>
	{#if $message}
		<span class="error">{$message}</span>
	{/if}
	<form class="space-y-4" method="POST" use:enhance>
		<div>
			<label class="label" for="username">
				<span class="label-text">ユーザー名</span>
			</label>
			<input
				class="input"
				class:input-error={$errors.username || $message}
				type="text"
				name="username"
				bind:value={$form.username}
				disabled={$submitting}
				autocomplete="username"
			/>
			{#if $errors.username}
				<span class="error">{$errors.username[0]}</span>
			{/if}
		</div>

		<div>
			<label class="label" for="password">
				<span class="label-text">パスワード</span>
			</label>
			<input
				class="input"
				class:input-error={$errors.password || $message}
				type="password"
				name="password"
				bind:value={$form.password}
				disabled={$submitting}
				autocomplete="current-password"
			/>
			{#if $errors.password}
				<span class="error">{$errors.password[0]}</span>
			{/if}
		</div>

		<div>
			<button class="btn btn-primary btn-block" disabled={$submitting}>ログイン</button>
		</div>
		<div class="for-guest">
			アカウントをお持ちでない方は<a class="link" href="/signup">サインアップ</a>
		</div>
	</form>
</div>

<style lang="postcss">
	label span {
		@apply text-base;
	}
	input[type='text'],
	input[type='password'] {
		@apply input-bordered w-full;
	}
	span.error {
		@apply text-xs text-error;
	}
	.for-guest {
		@apply text-sm;
	}
	.for-guest a {
		@apply link-hover link-accent;
	}
</style>
