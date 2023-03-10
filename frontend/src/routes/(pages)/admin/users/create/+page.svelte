<script lang="ts">
	import UserForm from '$lib/components/form/UserForm.svelte';
	import { addToast } from '$lib/components/Toast.svelte';
	import type { ActionData } from './$types';

	console.log(`frontend/src/routes/(pages)/admin/users/create/+page.svelte`);
	export let form: ActionData;

	if (form) {
		console.log(form);
		if (form.success) {
			addToast(`ユーザー${form.formData.username}を保存しました。`, `alert-success`);
			form.formData.username = '';
			form.formData.password = '';
			form.formData.displayName = '';
			form.formData.abbrev = '';
			form.formData.sei = '';
			form.formData.mei = '';
			form.formData.seiKana = '';
			form.formData.meiKana = '';
			form.formData.blocked = false;
		} else if (form.message) {
			addToast(form.message, `alert-error`);
		}
	}
</script>

<UserForm data={form?.formData} errors={form?.errors} />
