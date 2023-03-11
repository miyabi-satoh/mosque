<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { addToast } from '$lib/components/Toast.svelte';
	import UserForm from '$lib/components/form/UserForm.svelte';
	import type { UserCreate } from '$lib/user';

	console.log(`/routes/(pages)/admin/users/[id=number]/edit/+page.svelte`);
	export let data: PageData;
	export let form: ActionData;
	let userData: UserCreate;

	if (form) {
		if (form.success) {
			addToast(`ユーザー${form.formData.username}を保存しました。`, `alert-success`);
		} else if (form.message) {
			addToast(form.message, `alert-error`);
		}
		userData = form.formData;
	} else if (data.user) {
		userData = data.user as UserCreate;
	}
</script>

{#if userData}
	<UserForm data={userData} errors={form?.errors} />
{:else}
	<p>対象のデータが見つかりません。</p>
{/if}
