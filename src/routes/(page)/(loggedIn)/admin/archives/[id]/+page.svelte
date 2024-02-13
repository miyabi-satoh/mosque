<script lang="ts">
	import type { PageData } from './$types';
	import { format } from 'date-fns';
	import Icon from '@iconify/svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { tick } from 'svelte';
	import { submittingStore } from '$lib/stores';
	import { enhance } from '$app/forms';

	export let data: PageData;
	let showHiddenFiles = false;

	// const { form, submitting, enhance, message } = superForm(data.form, {
	// 	dataType: 'json'
	// });
	// $: $submittingStore = $submitting;

	type ItemT = (typeof data.items)[0];
	let items: ItemT[];

	function formatSize(n: number | undefined): string {
		if (n === undefined) {
			return '';
		} else if (n < 1024) {
			return `${n}B`;
		} else if (n < 1024 * 1024) {
			return `${Math.round(n / 1024)}KB`;
		} else if (n < 1024 * 1024 * 1024) {
			return `${Math.round(n / (1024 * 1024))}MB`;
		} else {
			return `${Math.round(n / (1024 * 1024 * 1024))}GB`;
		}
	}

	function filterItems(show: boolean) {
		return !show
			? data.items.filter((item) => item.name === '..' || !item.name.startsWith('.'))
			: data.items;
	}

	$: items = filterItems(showHiddenFiles);

	let targetDir: string;
	let elForm: HTMLFormElement;
	async function onRowClick(item: ItemT) {
		if (item.isDir) {
			$submittingStore = true;
			targetDir = item.name;
			await tick();
			elForm.submit();
		}
	}
</script>

<form method="post" action="?/cd" bind:this={elForm} use:enhance>
	<input type="hidden" name="currentDir" value={data.currentDir} />
	<input type="hidden" name="targetDir" value={targetDir} />
</form>

<div class="mx-4 space-y-4">
	<h2 class="h2">{data.archive.title}</h2>
	<div class="border-surface-400-500-token rounded border px-2 py-1">
		{data.currentDir}
	</div>
	<div>
		<SlideToggle name="showHiddenFiles" size="sm" bind:checked={showHiddenFiles}
			>Show hidden files</SlideToggle
		>
	</div>
	<div class="table-container">
		<table class="table table-hover table-compact">
			<thead>
				<tr>
					<th class="table-cell-fit"></th>
					<th>Name</th>
					<th class="table-cell-fit">Size</th>
					<th class="table-cell-fit">Mod Time</th>
				</tr>
			</thead>
			<tbody>
				{#each items as item}
					<tr class="cursor-pointer" on:click={() => onRowClick(item)}>
						<td class="table-cell-fit">
							{#if !item.isDir}
								<input class="checkbox" type="checkbox" />
							{/if}
						</td>
						<td>
							<div class="flex items-center gap-2">
								<Icon icon={item.isDir ? 'mdi:folder' : 'mdi:file'} height="16" />
								{item.name}
							</div>
						</td>
						<td class="table-cell-fit text-right">{formatSize(item.size)}</td>
						<td class="!table-cell-fit">
							{item.mtime ? format(item.mtime, 'yyyy-MM-dd HH:mm') : ''}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<!-- {#if $message}
		<h3 class:invalid={$page.status >= 400}>{$message}</h3>
	{/if}

	<form method="post" class="space-y-4" use:enhance>
		<input type="hidden" name="id" bind:value={$form.id} />

		<label class="label">
			<span>Filter 1</span>
			<select class="select" name="filter1">
				<option value=""></option>
				<option value="year">Year</option>
				<option value="grade">Grade</option>
				<option value="grade">Grade</option>
			</select>
		</label>

		<label class="label">
			<span>Slug</span>
			<input
				class="input"
				name="slug"
				aria-invalid={$errors.slug ? 'true' : undefined}
				bind:value={$form.slug}
				placeholder="e.g. docs"
				{...$constraints.slug}
			/>
			{#if $errors.slug}
				<span class="invalid">{$errors.slug}</span>
			{/if}
		</label>

		<label class="label">
			<span>Sort Order</span>
			<input
				type="number"
				class="input ml-2 w-20"
				name="sortOrder"
				aria-invalid={$errors.sortOrder ? 'true' : undefined}
				bind:value={$form.sortOrder}
				{...$constraints.sortOrder}
			/>
			{#if $errors.sortOrder}
				<span class="invalid">{$errors.sortOrder}</span>
			{/if}
		</label>

		<div class="text-right">
			<SubmitButton />
		</div>
	</form> -->
</div>
