<script lang="ts">
	import { HelperText, SubmitButton } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import Icon from '@iconify/svelte';

	export let data: PageData;
	const { form, submitting, message, enhance } = superForm(data.form);
	$: $submittingStore = $submitting;
</script>

<form class="contents space-y-4" method="POST" use:enhance>
	<div class="mx-4 flex">
		<HelperText class="flex-1" usePageStatus>{$message ?? ''}</HelperText>
		<SubmitButton disabled={$submitting}>
			<span><Icon icon="mdi:account-multiple-plus" height="auto" /></span>
			<span>Create accounts</span>
		</SubmitButton>
	</div>
	<div class="mx-4 flex flex-1">
		<textarea
			class="textarea flex-1"
			name="csv"
			placeholder={data.csvHeader}
			disabled={$submitting}
			bind:value={$form.csv}
		/>
	</div>
</form>
