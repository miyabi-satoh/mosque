<script lang="ts">
	import type { ActionData } from './$types';
	import UserForm from '$lib/components/form/UserForm.svelte';
	import { addToast } from '$lib/components/Toast.svelte';
	import { goto } from '$app/navigation';
	import { MSG, URL_ADMIN_USERS, URL_EDIT } from '$lib/constants';

	console.log(`/routes/(pages)/admin/users/create/+page.svelte`);
	export let form: ActionData;

	$: formReaction(form);
	const formReaction = (_form: ActionData) => {
		if (form) {
			console.log(`form reaction`);
			if (form.success) {
				addToast(MSG.SAVE_OK(form.formData.username), `alert-success`);
				goto(URL_EDIT(URL_ADMIN_USERS, form.id));
			} else if (form.message) {
				addToast(form.message, `alert-error`);
			}
		}
	};
</script>

<UserForm data={form?.formData} errors={form?.errors} />
