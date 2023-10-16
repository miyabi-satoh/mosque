<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';

	// eslint-disable-next-line
	export let parent: any;

	const modalStore = getModalStore();

	async function onOkClick() {
		if ($modalStore[0].response) {
			$modalStore[0].response(value);
		}
		modalStore.close();
	}

	function onKeydown(event: CustomEvent<KeyboardEvent>): void {
		const e = event.detail;
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			onOkClick();
		}
	}

	let value = $modalStore[0] ? $modalStore[0].meta.message : '';
</script>

{#if $modalStore[0]}
	<div class="card w-modal flex flex-col space-y-4 p-4 shadow-xl">
		{#await import('$lib/components/MarkdownEditor.svelte') then Module}
			<Module.default class="flex-1" bind:value on:keydown={onKeydown} />
		{/await}
		<!-- <MarkdownEditor class="flex-1" bind:value /> -->

		<footer class="modal-footer {parent.regionFooter}">
			<button type="button" class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button type="button" class="btn {parent.buttonPositive}" on:click={onOkClick}>OK</button>
		</footer>
	</div>
{/if}
