<script lang="ts">
	import { browser } from '$app/environment';
	import { MainContainer } from '$lib';
	import { submittingStore } from '$lib/stores';
	import Icon from '@iconify/svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	let allChecked: boolean = false;

	const { form, submitting, enhance } = superForm(data.form, {
		taintedMessage: false
	});
	$: $submittingStore = $submitting;

	$: if (browser) {
		updateChecked(allChecked);
	}
	function updateChecked(checked: boolean) {
		window.document.querySelectorAll(`.entry`).forEach((e: Element) => {
			const el = e as HTMLInputElement;
			el.checked = checked;
		});
	}

	$: countOk = data.entries.filter((e) => e.state === 'ok').length;
	$: countNew = data.entries.filter((e) => e.state === 'new').length;
</script>

<MainContainer innerScroll>
	{#if data.entries.length > 0}
		<form
			class="flex flex-1 flex-col overflow-y-hidden"
			method="POST"
			use:enhance
			on:submit={() => {
				allChecked = false;
			}}
		>
			<div class="flex items-center p-4">
				<p class="flex-1">
					{#if countOk === 0}
						There are no files registered in the database.
					{:else}
						{countOk} {countOk > 1 ? `files are` : `file is`} registered in the database.
					{/if}
					{#if countNew > 0}
						<br />
						{countNew}
						{countNew > 1 ? `files are` : `file is`} not registered in the database.
					{/if}
				</p>
				<button class="variant-ghost-primary btn" disabled={$submitting}>Save</button>
			</div>

			<div class="bg-surface-200-700-token mx-4">
				<div class="flex items-center px-2">
					<input type="checkbox" class="checkbox p-2" bind:checked={allChecked} />
					{#each data.headers as head, i}
						<span
							class:border-l={i !== 0}
							class="border-surface-300-600-token p-2 text-center {head.classOpt}"
						>
							{head.label}
						</span>
					{/each}
				</div>
			</div>
			<div class="mx-4 flex-1 space-y-2 overflow-y-scroll py-2">
				{#each data.entries as entry}
					<label class="flex items-center px-2 hover:text-primary-500">
						{#if entry.state !== 'missing'}
							<input
								type="checkbox"
								class="entry checkbox px-2"
								bind:group={$form.checked}
								name="checked"
								value={entry.id}
							/>
						{:else}
							<Icon icon="mdi:close-circle" height="auto" />
						{/if}
						<span class="{data.headers[0].classOpt} px-2">{entry.year?.label}</span>
						<span class="{data.headers[1].classOpt} px-2 text-center">{entry.numOf?.label}</span>
						<span class="{data.headers[2].classOpt} px-2 text-center">{entry.grade?.label}</span>
						<span class="{data.headers[3].classOpt} px-2 text-center">{entry.category?.label}</span>
						<span class="{data.headers[4].classOpt} px-2">{entry.path}</span>
					</label>
				{/each}
			</div>
		</form>
	{:else}
		<div class="p-4">{data.exam?.shortName}No files found.</div>
	{/if}
</MainContainer>
