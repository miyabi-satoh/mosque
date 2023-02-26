<script lang="ts">
	import type { ActionData } from './$types';
	import { addToast } from '$lib/components/Toast.svelte';
	import { userStore } from '$lib/user';

	export let form: ActionData;
	$: if (form?.message) {
		addToast(form.message, form.user ? 'alert-success' : 'alert-error');
		if (form.user) {
			$userStore = form.user;
		}
	}
</script>

{#if !$userStore}
	<p>このページはログインが必要です。</p>
{:else}
	<form method="POST">
		<div class="flex flex-col gap-4">
			<div class="flex flex-col sm:col-span-2">
				<label for="currrent_password">現在のパスワード</label>
				<input
					type="password"
					class="input input-bordered w-full"
					id="currrent_password"
					name="currrent_password"
					required
				/>
			</div>
			<div class="flex flex-col sm:col-span-2">
				<label for="new_password">新しいパスワード(8文字以上)</label>
				<input
					type="password"
					class="input input-bordered w-full"
					id="new_password"
					name="new_password"
					minlength="8"
					required
				/>
			</div>
			<div class="flex flex-col sm:col-span-2">
				<label for="confirm_password">新しいパスワード(確認用)</label>
				<input
					type="password"
					class="input input-bordered w-full"
					id="confirm_password"
					name="confirm_password"
					minlength="8"
					required
				/>
			</div>
			<div class="flex items-end">
				<button class="btn btn-primary">更新</button>
			</div>
		</div>
	</form>
{/if}
