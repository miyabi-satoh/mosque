<script lang="ts">
	import { browser } from '$app/environment';
	import { submittingStore } from '$lib/stores';
	import Icon from '@iconify/svelte';
	import { formatRFC7231 } from 'date-fns';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, errors, constraints, submitting, enhance, capture, restore } = superForm(
		data.form,
		{
			resetForm: true,
			taintedMessage: false
		}
	);
	export const snapshot = { capture, restore };
	$: $submittingStore = $submitting;

	function formatNow() {
		return formatRFC7231(new Date());
	}
	let now = formatNow();

	onMount(() => {
		if (browser) {
			const timerId = window.setInterval(() => (now = formatNow()), 1000);
			return () => clearInterval(timerId);
		}
	});
</script>

<main class="container mx-auto flex flex-1 flex-col lg:max-w-3xl">
	<p class="text-center">{now}</p>
	<form method="POST" use:enhance class="mx-auto w-96 space-y-4 p-4">
		<label class="label">
			<span>認証コード</span>
			<input
				class="input"
				class:input-error={$errors.code}
				type="password"
				name="code"
				bind:value={$form.code}
				{...$constraints.code}
			/>
		</label>
		<button class="variant-filled btn w-full">送信</button>
		{#if $errors.code}
			<aside class="alert variant-filled-error">
				<!-- Icon -->
				<div><Icon icon="mdi:alert-circle" height="auto" /></div>
				<!-- Message -->
				<div class="alert-message">
					{$errors.code}
				</div>
			</aside>
		{/if}
	</form>
</main>
