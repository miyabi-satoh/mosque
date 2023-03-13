<script lang="ts">
	import type { ActionData } from './$types';
	import { goto } from '$app/navigation';
	import { MSG, URL_ADMIN_RESOURCES, URL_EDIT } from '$lib/constants';
	import { addToast } from '$lib/components/organisms/Toast.svelte';
	import ResourceForm from '$lib/components/organisms/ResourceForm.svelte';

	console.log(`/routes/(pages)/admin/users/create/+page.svelte`);
	export let form: ActionData;

	if (form) {
		console.log(form);
		if (form.success) {
			addToast(MSG.SAVE_OK(form.formData.title), `alert-success`);
			goto(URL_EDIT(URL_ADMIN_RESOURCES, form.id));
		} else if (form.message) {
			addToast(form.message, `alert-error`);
		}
	}
</script>

<ResourceForm data={form?.formData} errors={form?.errors} />
