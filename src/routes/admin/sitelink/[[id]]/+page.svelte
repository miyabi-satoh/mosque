<script lang="ts">
	import { page } from '$app/stores';
	import { MainContainer } from '$lib';
	import HelperText from '$lib/components/HelperText.svelte';
	import { URLS } from '$lib/consts';
	import { submittingStore } from '$lib/stores';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;
	const { form, message, errors, constraints, submitting, enhance } = superForm(data.form, {
		resetForm: true,
		taintedMessage: false
	});
	$: $submittingStore = $submitting;

	$: if ($form.url.match(/^https?:\/\/[^/]/) && !$form.title) fetchTitle();
	async function fetchTitle() {
		try {
			const url = encodeURIComponent($form.url);
			const res = await fetch(`${URLS.API_FETCH}${url}`);
			if (res.ok) {
				const html = await res.text();
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, 'text/html');
				console.log(doc.title);
				$form.title = doc.title;
			}
		} catch (e) {
			console.log(e);
		}
	}
</script>

<MainContainer innerScroll>
	<form method="POST" use:enhance>
		<div class="border-surface-400-500-token mb-2 flex flex-col gap-4 border-b px-4 py-2">
			<HelperText usePageStatus size="base">
				{$message ?? ''}
			</HelperText>
			<div>
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
							bind:value={$form.title}
							disabled={$submitting}
							{...$constraints.title}
						/>
						{#if $errors.title}
							<span class="text-error-400-500-token">{$errors.title[0]}</span>
						{/if}
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
						{#if $errors.sortOrder}
							<span class="text-error-400-500-token">{$errors.sortOrder[0]}</span>
						{/if}
					</div>
				</div>

				<div class="flex justify-end gap-x-4">
					{#if $page.params.id}
						<a class="variant-filled btn" href={URLS.ADMIN_SITELINK}>Cancel</a>
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
		</div>
	</form>
	<div class="flex flex-col gap-4 p-4">
		{#each data.siteLinks as siteLink (siteLink.id)}
			<div class="flex items-center gap-4">
				<span>
					{siteLink.sortOrder} -
					<a class="anchor" href={siteLink.url}>{siteLink.title}</a>
				</span>
				<a class="variant-filled btn btn-sm" href={`${URLS.ADMIN_SITELINK}/${siteLink.id}`}>Edit</a>
			</div>
		{/each}
	</div>
</MainContainer>
