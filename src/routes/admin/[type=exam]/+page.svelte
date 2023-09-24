<script lang="ts">
	import { browser } from '$app/environment';
	import { submittingStore } from '$lib/stores';
	import Icon from '@iconify/svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	let allChecked: boolean = false;

	const { form, submitting, enhance, capture, restore } = superForm(data.form, {
		taintedMessage: false
	});
	export const snapshot = { capture, restore };
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

	function handleClick() {
		const f = window.document.getElementById('form');
		if (f) {
			(f as HTMLFormElement).submit();
		}
	}
</script>

<!-- <SuperDebug data={$form} display={true} /> -->
<main class="container mx-auto flex flex-1 flex-col overflow-y-hidden lg:max-w-3xl">
	{#if data.entries.length > 0}
		<div class="flex items-center p-4">
			<p class="flex-1">
				{data.count.ok}件のデータがデータベースに登録されています。
				{#if data.count.new > 0}
					<br />
					{data.count.new}件の未登録データがあります。
				{/if}
				{#if data.count.missing > 0}
					<br />
					存在しないファイルが{data.count.missing}件あります。
				{/if}
			</p>
			<button class="variant-ghost-primary btn" disabled={$submitting} on:click={handleClick}
				>更新</button
			>
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
		<form
			id="form"
			class="mx-4 flex-1 space-y-2 overflow-y-scroll py-2"
			method="POST"
			use:enhance
			on:submit={() => {
				allChecked = false;
			}}
		>
			{#each data.entries as entry}
				<label class="flex items-center px-2 hover:text-primary-500">
					{#if entry.state !== data.ResourceState.missing}
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
		</form>
	{:else}
		<div class="p-4">{data.exam?.shortName}関連ファイルが見つかりませんでした。</div>
	{/if}
</main>
