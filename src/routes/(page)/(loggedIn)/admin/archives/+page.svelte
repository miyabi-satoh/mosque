<script lang="ts">
	import { URLS } from '$lib/consts';
	import type { PageData } from './$types';
	import { LinkButton } from '$lib';
	import Icon from '@iconify/svelte';
	import { SOURCES, TRIGGERS, dndzone } from 'svelte-dnd-action';
	import { superForm } from 'sveltekit-superforms';
	import { tick } from 'svelte';
	import { submittingStore } from '$lib/stores';

	export let data: PageData;
	let elemSubmit: HTMLButtonElement;
	let dragDisabled = true;
	type ListItem = PageData['archives'][0];

	const { form, enhance, submitting } = superForm(data.form, {
		dataType: 'json',
		resetForm: false
	});
	$: $submittingStore = $submitting;

	// eslint-disable-next-line no-undef
	function onConsider(event: CustomEvent<DndEvent<ListItem>>) {
		const {
			items,
			info: { source, trigger }
		} = event.detail;
		data.archives = items;
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			dragDisabled = true;
		}
	}

	// eslint-disable-next-line no-undef
	async function onFinalize(event: CustomEvent<DndEvent<ListItem>>) {
		const {
			items,
			info: { source }
		} = event.detail;

		data.archives = items;
		if (source === SOURCES.POINTER) {
			dragDisabled = true;
		}

		const before = JSON.stringify($form.orders.map((a) => a.id));
		const after = JSON.stringify(items.map((a) => a.id));
		if (before !== after) {
			for (let i = 0; i < data.archives.length; i++) {
				data.archives[i].sortOrder = i;
				$form.orders[i].id = data.archives[i].id;
				$form.orders[i].sortOrder = data.archives[i].sortOrder;
			}
			if (elemSubmit) {
				await tick();
				elemSubmit.click();
			}
		}
	}
	function startDrag(event: Event) {
		event.preventDefault();
		dragDisabled = false;
	}
	function onKeyDown(event: KeyboardEvent) {
		if ((event.key === 'Enter' || event.key === ' ') && dragDisabled) dragDisabled = false;
	}
</script>

<div class="mx-4 space-y-4">
	<LinkButton href={URLS.ADMIN_ARCHIVES('new')}>New archive</LinkButton>
	<p class="opacity-75">Items can be reordered by dragging and dropping.</p>
	<form method="post" use:enhance>
		<button class="hidden" bind:this={elemSubmit} />
		{#each $form.orders as _, i}
			<input type="hidden" name="id" bind:value={$form.orders[i].id} />
			<input type="hidden" name="sortOrder" bind:value={$form.orders[i].sortOrder} />
		{/each}
	</form>
	<div
		use:dndzone={{ items: data.archives, dragDisabled, dropTargetStyle: {} }}
		on:consider={onConsider}
		on:finalize={onFinalize}
	>
		{#each data.archives as archive (archive.id)}
			<div class="card my-4">
				<section class="flex items-center gap-x-4 p-4">
					<div>
						<button
							aria-label="drag-handle"
							class={dragDisabled ? 'cursor-grab' : 'cursor-grabbing'}
							on:mousedown={startDrag}
							on:touchstart={startDrag}
							on:keydown={onKeyDown}
						>
							<Icon icon="mdi:menu" height="32" />
						</button>
					</div>
					<div class="flex-1">
						<h4 class="h4">
							{archive.title}
						</h4>
						<p class="flex items-center opacity-50">
							<Icon icon="mdi:folder" />
							<span class="ml-2">{archive.root}</span>
						</p>
						<p class="flex items-center opacity-50">
							<Icon icon="mdi:files" />
							<span class="ml-2">0 File(s) registered.</span>
						</p>
					</div>
					<div>
						<a
							href={URLS.ADMIN_ARCHIVES(archive.id)}
							title="Edit"
							class="variant-filled-secondary btn-icon btn-icon-sm"
						>
							<Icon icon="mdi:edit" />
						</a>
					</div>
				</section>
			</div>
		{/each}
	</div>
</div>
