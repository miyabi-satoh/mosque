<script lang="ts">
	import { URLS } from '$lib/consts';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { HelperText, LinkButton, SubmitButton } from '$lib';
	import Icon from '@iconify/svelte';
	// import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data: PageData;
	const { form, errors, enhance, constraints, message } = superForm(data.form, {
		dataType: 'json',
		onUpdated: ({ form }) => {
			if (form.valid) {
				// eslint-disable-next-line svelte/valid-compile
				$form.archives = $form.archives.sort((a, b) => b.sortOrder - a.sortOrder);
			}
		}
	});

	function onAddClick() {
		$form.archives.push({
			title: '',
			slug: '',
			module: 'common',
			sortOrder: 0
		});
		$form.archives = $form.archives;
	}

	function onRemoveClick(i: number) {
		$form.archives.splice(i, 1);
		$form.archives = $form.archives;
	}
</script>

<!-- <SuperDebug data={$form} /> -->

<div class="mx-4 space-y-4">
	<div class="flex items-center justify-end">
		{#if $message}
			<HelperText usePageStatus class="flex-1">{$message}</HelperText>
		{/if}
		<LinkButton href="/">New archive</LinkButton>
	</div>
	<form class="table-container space-y-4" method="post" use:enhance>
		<table class="table">
			<thead>
				<tr>
					<th>Title</th>
					<th>Slug</th>
					<th class="table-cell-fit">Order</th>
					<th class="table-cell-fit">Files</th>
					<th class="table-cell-fit"></th>
				</tr>
			</thead>
			<tbody>
				{#each $form.archives as _, i}
					<tr>
						<td>
							<input type="hidden" name="id" bind:value={$form.archives[i].id} />
							<input
								class="input"
								name="title"
								aria-invalid={$errors.archives?.[i]?.title ? 'true' : undefined}
								bind:value={$form.archives[i].title}
								{...$constraints.archives?.title}
							/>
							{#if $errors.archives?.[i]?.title}
								<br />
								<span class="invalid">{$errors.archives[i].title}</span>
							{/if}
						</td>
						<td>
							<input
								class="input"
								name="slug"
								aria-invalid={$errors.archives?.[i]?.slug ? 'true' : undefined}
								bind:value={$form.archives[i].slug}
								{...$constraints.archives?.slug}
							/>
						</td>
						<td class="table-cell-fit text-right">
							<input
								type="number"
								class="input w-20"
								name="sortOrder"
								aria-invalid={$errors.archives?.[i]?.sortOrder ? 'true' : undefined}
								bind:value={$form.archives[i].sortOrder}
								{...$constraints.archives?.sortOrder}
							/>
						</td>
						<td class="table-cell-fit text-right !align-middle">0</td>
						<td class="table-cell-fit !align-middle">
							{#if $form.archives[i].id}
								<a href={URLS.ADMIN_ARCHIVES($form.archives[i].id)}>
									<Icon icon="mdi:cog" height="auto" />
								</a>
							{:else}
								<button on:click={() => onRemoveClick(i)}>
									<Icon icon="mdi:close" height="auto" />
								</button>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
			<tfoot>
				<tr>
					<td colspan="5">
						<div class="flex items-center justify-between">
							<button type="button" class="variant-filled-secondary btn" on:click={onAddClick}>
								<span><Icon icon="mdi:plus" height="auto" /></span>
								<span>Add</span>
							</button>
							<SubmitButton />
						</div>
					</td>
				</tr>
			</tfoot>
		</table>
	</form>
</div>
