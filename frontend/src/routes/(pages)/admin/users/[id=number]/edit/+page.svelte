<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { addToast } from '$lib/components/Toast.svelte';
	import UserForm from '$lib/components/form/UserForm.svelte';
	import { MSG } from '$lib/constants';
	import type { UserUpdate } from '$lib/user';

	console.log(`/routes/(pages)/admin/users/[id=number]/edit/+page.svelte`);
	export let data: PageData;
	export let form: ActionData;
	let userData: UserUpdate;

	$: formReaction(form);

	const formReaction = (_form: ActionData) => {
		if (form) {
			console.log('form reaction');
			if (form.success) {
				addToast(MSG.SAVE_OK(form.formData.username), `alert-success`);
			} else if (form.message) {
				addToast(form.message, `alert-error`);
			}
			userData = form.formData;
		} else if (data.user) {
			userData = { ...data.user, password: '' };
		}
	};
</script>

{#if userData}
	<UserForm data={userData} errors={form?.errors} />
{:else}
	<p>{MSG.TARGET_NOT_FOUND}</p>
{/if}
