<script lang="ts">
	import { MainContainer } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, submitting, enhance, capture, restore } = superForm(data.form, {
		taintedMessage: false
	});
	export const snapshot = { capture, restore };
	$: $submittingStore = $submitting;
</script>

<MainContainer>
	<form class="flex flex-1 flex-col" method="POST" use:enhance>
		<div class="flex items-center px-4">
			<div class="flex-1">code, sei mei, seiKana, meiKana</div>
			<button class="variant-ghost-primary btn" disabled={$submitting}>更新</button>
		</div>
		<div class="flex flex-1 p-4">
			<textarea
				class="textarea flex-1"
				name="csv"
				placeholder="code, sei mei, seiKana meiKana"
				disabled={$submitting}
				bind:value={$form.csv}
			/>
		</div>
	</form>
</MainContainer>
