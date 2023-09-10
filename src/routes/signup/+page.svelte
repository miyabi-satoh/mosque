<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, message, errors, submitting, capture, restore, enhance } = superForm(data.form, {
		taintedMessage: false
	});
	export const snapshot = { capture, restore };
</script>

<div class="mx-auto w-full max-w-lg rounded-md p-6 shadow-2xl">
	<h1 class="text-center text-3xl font-semibold">サインアップ</h1>
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
				id="username"
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
				id="password"
				name="password"
				bind:value={$form.password}
				disabled={$submitting}
				autocomplete="new-password"
			/>
			{#if $errors.password}
				<span class="error">{$errors.password[0]}</span>
			{/if}
		</div>
		<div>
			<label class="label" for="confirmPassword">
				<span class="label-text">パスワード（確認）</span>
			</label>
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
			{#if $errors.confirmPassword}
				<span class="error">{$errors.confirmPassword[0]}</span>
			{/if}
		</div>

		<div>
			<button class="btn btn-primary btn-block" disabled={$submitting}>サインアップ</button>
		</div>
		<div class="for-user">
			すでにアカウントをお持ちの方は<a class="link" href="/login">ログイン</a>
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
	.for-user {
		@apply text-sm;
	}
	.for-user a {
		@apply link-hover link-accent;
	}
</style>
