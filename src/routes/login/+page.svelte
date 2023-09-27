<script lang="ts">
	import { HelperText, MainContainer } from '$lib';
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
		<HelperText class="text-center">
			{$message ?? ''}
		</HelperText>

		<form method="POST" use:enhance>
			<div class="my-2">
				<label class="label">
					<span>ログインID</span>
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
				<HelperText>
					{$errors.username ? $errors.username[0] : ''}
				</HelperText>
			</div>

			<div class="my-2">
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
				<HelperText>
					{$errors.password ? $errors.password[0] : ''}
				</HelperText>
			</div>

			<div class="my-4">
				<button class="variant-filled btn w-full" disabled={$submitting}>ログイン</button>
			</div>
		</form>
	</div>
</MainContainer>
