<script lang="ts">
	import { page } from '$app/stores';
	import { Scrollable } from '$lib';
	import HelperText from '$lib/components/HelperText.svelte';
	import { URLS } from '$lib/consts';
	import { submittingStore } from '$lib/stores';
	import Icon from '@iconify/svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, message, errors, constraints, submitting, enhance } = superForm(data.form);
	$: $submittingStore = $submitting;

	let hasTitleFocus: boolean = false;
	$: if ($form.url.match(/^https?:\/\/[^/]/) && !$form.title) fetchTitle();
	async function fetchTitle() {
		try {
			const url = encodeURIComponent($form.url);
			const res = await fetch(`${URLS.API_FETCH}${url}`);
			if (res.ok) {
				const html = await res.text();
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, 'text/html');
				if (!hasTitleFocus) $form.title = doc.title;
			}
		} catch (e) {
			console.log(e);
		}
	}
</script>

<form class="mx-4 space-y-4" method="POST" use:enhance>
	<div>
		<HelperText usePageStatus size="base">{$message ?? ''}</HelperText>
		<input
			class="input"
			class:input-error={$errors.url}
			type="text"
			name="url"
			title="Url"
			placeholder="Url"
			bind:value={$form.url}
			disabled={$submitting}
			autocomplete="url"
			{...$constraints.url}
		/>
		<HelperText>
			{$errors.url ? $errors.url[0] : ''}
		</HelperText>
	</div>
	{#if $form.url}
		<div class="flex gap-4">
			<div class="flex-1">
				<input
					class="input"
					class:input-error={$errors.title}
					type="text"
					name="title"
					title="Title"
					placeholder="Title"
					on:focus={() => (hasTitleFocus = true)}
					on:blur={() => (hasTitleFocus = false)}
					bind:value={$form.title}
					disabled={$submitting}
					{...$constraints.title}
				/>
				<HelperText>{$errors.title ? $errors.title[0] : ''}</HelperText>
			</div>
			<div>
				<input
					class="input w-20"
					class:input-error={$errors.sortOrder}
					type="number"
					title="sortOrder"
					name="sortOrder"
					bind:value={$form.sortOrder}
					disabled={$submitting}
					{...$constraints.sortOrder}
				/>
				<HelperText>{$errors.sortOrder ? $errors.sortOrder[0] : ''}</HelperText>
			</div>
		</div>

		<div class="flex justify-end gap-x-4">
			{#if $page.params.id}
				<a class="variant-filled btn" href={URLS.ADMIN_LINKS}>Cancel</a>
				<button
					name="delete"
					on:click={(e) =>
						!confirm('Are you sure you want to delete this link?') && e.preventDefault()}
					class="variant-ghost-warning btn"
					disabled={$submitting}
				>
					Delete
				</button>
			{/if}
			<button class="variant-ghost-primary btn" disabled={$submitting}>Save</button>
		</div>
	{/if}
</form>

<Scrollable class="mx-4 mt-4">
	<table class="w-full table-auto">
		<thead>
			<tr class="bg-surface-100-800-token sticky top-0">
				<th class="bg-surface-100-800-token sticky top-0 z-10 p-2">Title</th>
				<th class="bg-surface-100-800-token sticky top-0 z-10 p-2">Order</th>
			</tr>
		</thead>
		<tbody>
			{#each data.links as link}
				<tr class="odd:bg-surface-50-900-token even:bg-surface-200-700-token">
					<td class="flex items-center gap-x-2 p-2">
						<a class="anchor" href={`${URLS.ADMIN_LINKS}/${link.id}`}>{link.title}</a>
						<a class="anchor" href={link.url} target="_blank">
							<Icon icon="mdi:open-in-new" />
						</a>
					</td>
					<td class="p-2 text-right">{link.sortOrder}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</Scrollable>
