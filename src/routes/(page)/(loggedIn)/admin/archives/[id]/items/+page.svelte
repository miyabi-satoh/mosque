<script lang="ts">
	import { scrollable } from '$lib/actions/scrollable';
	import HelperText from '$lib/components/HelperText.svelte';
	import SubmitButton from '$lib/components/SubmitButton.svelte';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	const headerCellStyle = 'bg-surface-100-800-token sticky top-0 z-10 p-2';
	const cellStyle = 'whitespace-nowrap p-2';
	export let data: PageData;
	let allChecked = false;

	const { form, message, submitting, enhance } = superForm(data.form, {
		dataType: 'json',
		resetForm: false,
		onUpdated({ form }) {
			if (form.valid) {
				allChecked = false;
			}
		}
	});
	$: $submittingStore = $submitting;

	function onCheckAll(): void {
		allChecked = !allChecked;
		$form.checked = allChecked ? data.items.map((item) => item.id) : [];
	}

	$: allowed = data.items.filter((item) => item.state === 'allow').length;
</script>

<form method="post" class="flex flex-1 flex-col" use:enhance>
	<div class="m-4 flex items-center gap-x-2">
		<div class="flex-1">
			{#if $message}
				<HelperText usePageStatus>{$message}</HelperText>
			{/if}
			<p>{allowed} file(s) are allowed, and {data.items.length - allowed} files are denied.</p>
		</div>
		<SubmitButton />
	</div>
	<div class="flex-1 pl-4 pr-2" use:scrollable>
		<table class="w-full table-auto">
			<thead>
				<tr class="bg-surface-100-800-token sticky top-0 text-sm">
					<th class="{headerCellStyle} table-cell-fit">
						<input type="checkbox" class="checkbox" checked={allChecked} on:click={onCheckAll} />
					</th>
					<th class="{headerCellStyle} table-cell-fit"> Year </th>
					<th class="{headerCellStyle} table-cell-fit"> Section </th>
					<th class="{headerCellStyle} table-cell-fit"> Grade </th>
					<th class="{headerCellStyle} table-cell-fit"> Title </th>
					<th class={headerCellStyle}> Path </th>
				</tr>
			</thead>
			<tbody class="text-sm">
				{#each data.items as item}
					<tr class="odd:bg-surface-50-900-token even:bg-surface-200-700-token">
						<td class="table-cell-fit p-2 text-center">
							<input
								type="checkbox"
								class="checkbox px-2"
								bind:group={$form.checked}
								value={item.id}
							/>
						</td>
						<td class="{cellStyle} table-cell-fit">{item.strYear}</td>
						<td class="{cellStyle} table-cell-fit">{item.strSequence}</td>
						<td class="{cellStyle} table-cell-fit">{item.strGrade}</td>
						<td class="{cellStyle} table-cell-fit">{item.title}</td>
						<td class="whitespace-nowrap p-2">{item.path}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</form>
