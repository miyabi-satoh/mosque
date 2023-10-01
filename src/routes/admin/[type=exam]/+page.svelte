<script lang="ts">
	import { browser } from '$app/environment';
	import { MainContainer } from '$lib';
	import { submittingStore } from '$lib/stores';
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

			<div class="mx-4 flex-1 overflow-scroll">
				<table class="w-full table-auto">
					<thead>
						<tr class="bg-surface-100-800-token sticky top-0">
							<th class="bg-surface-100-800-token sticky top-0 z-10 p-2">
								<input type="checkbox" class="checkbox" bind:checked={allChecked} />
							</th>
							{#each data.headers as head}
								<th class="bg-surface-100-800-token sticky top-0 z-10 whitespace-nowrap p-2">
									{head}
								</th>
							{/each}
						</tr>
					</thead>
					<tbody class="text-xs">
						{#each data.entries as entry}
							<tr class="odd:bg-surface-50-900-token even:bg-surface-200-700-token">
								<td class="p-2">
									<input
										type="checkbox"
										class="entry checkbox px-2"
										bind:group={$form.checked}
										name="checked"
										value={entry.id}
									/>
								</td>
								<td class="whitespace-nowrap p-2">{entry.year?.label}</td>
								<td class="whitespace-nowrap p-2">{entry.numOf?.label}</td>
								<td class="whitespace-nowrap p-2">{entry.grade?.label}</td>
								<td class="whitespace-nowrap p-2">{entry.category?.label}</td>
								<td class="whitespace-nowrap p-2">{entry.path}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</form>
	{:else}
		<div class="p-4">{data.exam?.shortName}No files found.</div>
	{/if}
</MainContainer>
