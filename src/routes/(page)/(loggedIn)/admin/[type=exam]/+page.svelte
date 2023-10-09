<script lang="ts">
	import { HelperText, Scrollable, parentClass } from '$lib';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	let allChecked: boolean = false;

	const { form, message, submitting, enhance } = superForm(data.form);
	$: $submittingStore = $submitting;

	$: updateChecked(allChecked);
	function updateChecked(checked: boolean) {
		$form.checked = checked ? data.columnValues.map((v) => v.id) : [];
	}

	type ColumnValue = PageData['columnValues'][0];
	function showValue(value: ColumnValue, key: string) {
		return `${value[key as keyof ColumnValue]}`;
	}

	$: countOk = data.columnValues.filter((e) => e.state === 'ok').length;
	$: countNew = data.columnValues.filter((e) => e.state === 'new').length;
</script>

{#if data.columnValues.length > 0}
	<form
		class="{parentClass} mx-4 space-y-4"
		method="POST"
		use:enhance
		on:submit={() => {
			allChecked = false;
		}}
	>
		<div class="flex items-center gap-x-4">
			<p class="flex-1">
				<HelperText usePageStatus>{$message ?? ''}</HelperText>
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

		<Scrollable class="overflow-x-scroll">
			<table class="w-full table-auto">
				<thead>
					<tr class="bg-surface-100-800-token sticky top-0 text-sm">
						<th class="bg-surface-100-800-token sticky top-0 z-10 p-2">
							<input type="checkbox" class="checkbox" bind:checked={allChecked} />
						</th>
						{#each Object.values(data.columnLabels) as head}
							<th class="bg-surface-100-800-token sticky top-0 z-10 whitespace-nowrap p-2">
								{head}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody class="text-xs">
					{#each data.columnValues as values}
						<tr class="odd:bg-surface-50-900-token even:bg-surface-200-700-token">
							<td class="p-2 text-center">
								<input
									type="checkbox"
									class="entry checkbox px-2"
									bind:group={$form.checked}
									name="checked"
									value={values.id}
								/>
							</td>
							{#each Object.keys(data.columnLabels) as key}
								<td class="whitespace-nowrap p-2">{showValue(values, key)}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</Scrollable>
	</form>
{:else}
	<div class="p-4">No files found.</div>
{/if}
