<script lang="ts">
	import { autoResize } from '$lib/actions/autoResizeTextarea';
	import { getModalStore } from '@skeletonlabs/skeleton';

	// eslint-disable-next-line
	export let parent: any;

	const modalStore = getModalStore();

	async function onOkClick() {
		if ($modalStore[0].response) {
			$modalStore[0].response(elemTextarea.value);
		}
		modalStore.close();
	}

	let elemTextarea: HTMLTextAreaElement;
</script>

{#if $modalStore[0]}
	<div class="card w-modal flex flex-col space-y-4 p-4 shadow-xl">
		<!-- NOTE: なぜかbind:valueだと挙動がおかしくなる -->
		<textarea
			class="textarea resize-none overflow-y-auto text-sm"
			rows="1"
			bind:this={elemTextarea}
			use:autoResize>{$modalStore[0].meta.message}</textarea
		>
		<footer class="modal-footer {parent.regionFooter}">
			<button type="button" class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button type="button" class="btn {parent.buttonPositive}" on:click={onOkClick}>OK</button>
		</footer>
	</div>
{/if}
