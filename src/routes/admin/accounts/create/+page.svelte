<script lang="ts">
	import { HelperText, MainContainer } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, submitting, message, enhance } = superForm(data.form);
	$: $submittingStore = $submitting;
</script>

<MainContainer>
	<HelperText class="p-4" usePageStatus>
		{$message ?? ''}
	</HelperText>
	<form class="flex flex-1 flex-col" method="POST" use:enhance>
		<div class="flex items-center px-4">
			<div class="flex-1">{data.csvHeader}</div>
			<button class="variant-ghost-primary btn" disabled={$submitting}>Create accounts</button>
		</div>
		<div class="flex flex-1 p-4">
			<textarea
				class="textarea flex-1"
				name="csv"
				placeholder={data.csvHeader}
				disabled={$submitting}
				bind:value={$form.csv}
			/>
		</div>
	</form>
</MainContainer>
