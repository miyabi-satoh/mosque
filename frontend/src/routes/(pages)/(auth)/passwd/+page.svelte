<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { addToast } from '$lib/components/Toast.svelte';
	// import { userStore } from '$lib/user';
	import { fields } from '$lib/fields';

	export let data: PageData;
	export let form: ActionData;
	$: if (form?.message) {
		addToast(form.message, 'alert-error');
		// if (form.user) {
		// 	$userStore = form.user;
		// }
	}
</script>

{#if !data.user}
	<p>このページはログインが必要です。</p>
{:else}
	<form method="POST">
		<div class="flex flex-col gap-4">
			<div class="flex flex-col sm:col-span-2">
				<label for={fields.passwd.currentPassword.name}>{fields.passwd.currentPassword.label}</label
				>
				<input
					type="password"
					class="input input-bordered w-full"
					id={fields.passwd.currentPassword.name}
					name={fields.passwd.currentPassword.name}
					required
				/>
			</div>
			<div class="flex flex-col sm:col-span-2">
				<label for={fields.passwd.newPassword.name}>
					{fields.passwd.newPassword.label}
					{fields.passwd.newPassword.helperText}
				</label>
				<input
					type="password"
					class="input input-bordered w-full"
					id={fields.passwd.newPassword.name}
					name={fields.passwd.newPassword.name}
					minlength={fields.passwd.newPassword.minlength}
					required
				/>
			</div>
			<div class="flex flex-col sm:col-span-2">
				<label for={fields.passwd.confirmPassword.name}>{fields.passwd.confirmPassword.label}</label
				>
				<input
					type="password"
					class="input input-bordered w-full"
					id={fields.passwd.confirmPassword.name}
					name={fields.passwd.confirmPassword.name}
					required
				/>
			</div>
			<div class="flex items-end">
				<button class="btn btn-primary">更新</button>
			</div>
		</div>
	</form>
{/if}
