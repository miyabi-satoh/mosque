<script lang="ts">
	import { HelperText } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, submitting, message, enhance } = superForm(data.form);
	$: $submittingStore = $submitting;
</script>

<form class="mx-4 flex flex-1 flex-col space-y-4" method="POST" use:enhance>
	{#if $message}
		<HelperText usePageStatus>{$message}</HelperText>
	{/if}

	<div class="text-right">
		<button type="submit" class="variant-ghost-primary btn" disabled={$submitting}
			>Create accounts</button
		>
	</div>

	<textarea
		class="textarea flex-1"
		name="csv"
		placeholder={data.csvHeader}
		disabled={$submitting}
		bind:value={$form.csv}
	/>
</form>
