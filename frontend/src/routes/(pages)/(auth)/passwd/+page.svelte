<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { fields } from '$lib/fields';
	import { enhance } from '$app/forms';
	import { addToast } from '$lib/components/organisms/Toast.svelte';
	import InputText from '$lib/components/molecules/InputText.svelte';
	console.log(`/routes/(pages)/(auth)/passwd/+page.svelte`);

	export let data: PageData;
	export let form: ActionData;

	$: formReaction(form);
	const formReaction = (_form: ActionData) => {
		if (form?.message) {
			addToast(form.message, form.success ? 'alert-success' : 'alert-error');
		}
	};
</script>

{#if !data.user}
	<p>このページはログインが必要です。</p>
{:else}
	<form method="POST" use:enhance>
		<div class="flex flex-col gap-4">
			<InputText
				type="password"
				name={fields.passwd.currentPassword.name}
				required
				helperText={form?.errors?.currentPassword}>{fields.passwd.currentPassword.label}</InputText
			>
			<InputText
				type="password"
				name={fields.passwd.newPassword.name}
				minlength={fields.passwd.newPassword.minlength}
				required
				helperText={form?.errors?.newPassword}
			>
				{fields.passwd.newPassword.label}
				{fields.passwd.newPassword.helperText}
			</InputText>
			<InputText
				type="password"
				name={fields.passwd.confirmPassword.name}
				required
				helperText={form?.errors?.confirmPassword}
				>{fields.passwd.confirmPassword.label}
			</InputText>
			<div>
				<button class="btn btn-primary">更新</button>
			</div>
		</div>
	</form>
{/if}
