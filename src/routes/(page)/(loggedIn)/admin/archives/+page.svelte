<script lang="ts">
	import { LinkButton } from '$lib';
	import { URLS } from '$lib/consts';
	import { submittingStore } from '$lib/stores';
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte';
	import { SOURCES, TRIGGERS, dndzone, type DndEvent } from 'svelte-dnd-action';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	export let data: PageData;
	let elemSubmit: HTMLButtonElement;
	let dragDisabled = true;
	type ListItem = PageData['archives'][0];

	const { form, enhance, submitting } = superForm(data.form, {
		dataType: 'json',
		resetForm: false
	});
	$: $submittingStore = $submitting;

	/**
	 * ドラッグ操作が行われている際の処理
	 * @param event CustomEvent<DndEvent<ListItem>>
	 */
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
	/**
	 * ドラッグ操作が完了した際の処理
	 * @param event CustomEvent<DndEvent<ListItem>>
	 */
	async function onFinalize(event: CustomEvent<DndEvent<ListItem>>) {
		const {
			items,
			info: { source }
		} = event.detail;

		data.archives = items;
		if (source === SOURCES.POINTER) {
			dragDisabled = true;
		}

		// ドラッグ操作により並び順が変更されたかチェックします
		const before = JSON.stringify($form.orders.map((a) => a.id));
		const after = JSON.stringify(items.map((a) => a.id));
		if (before !== after) {
			// 並び順を更新します
			for (let i = 0; i < data.archives.length; i++) {
				data.archives[i].sortOrder = i;
				$form.orders[i].id = data.archives[i].id;
				$form.orders[i].sortOrder = data.archives[i].sortOrder;
			}
			// form.submit()ではenhanceが正しく機能しないので
			// button.click()でイベントを発火させます
			if (elemSubmit) {
				await tick();
				elemSubmit.click();
			}
		}
	}

	/**
	 * ドラッグ操作が開始された際の処理
	 * @param event Event
	 */
	function startDrag(event: Event) {
		event.preventDefault();
		dragDisabled = false;
	}

	/**
	 * キーボードのキーが押された際の処理
	 * @param event KeyboardEvent
	 */
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
							<a href={URLS.ADMIN_ARCHIVE_ITEMS(archive.id)} class="anchor ml-2"
								>{archive._count.items} file(s) are published.</a
							>
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
