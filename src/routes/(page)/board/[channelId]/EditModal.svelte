<script lang="ts">
	import { AutoResizeTextarea } from '$lib';
	import { getModalStore } from '@skeletonlabs/skeleton';

	// eslint-disable-next-line
	export let parent: any;

	const modalStore = getModalStore();
	const textareaId = 'textarea-in-modal';

	async function onOkClick() {
		if ($modalStore[0].response) {
			const el = window.document.getElementById(textareaId) as HTMLTextAreaElement;
			if (el) {
				$modalStore[0].response(el.value);
			}
		}
		modalStore.close();
	}
</script>

{#if $modalStore[0]}
	<div class="card w-modal flex flex-col space-y-4 p-4 shadow-xl">
		<AutoResizeTextarea target={textareaId} />
		<!-- NOTE: なぜかbind:valueだと挙動がおかしくなる -->
		<textarea class="textarea" id={textareaId}>{$modalStore[0].meta.message}</textarea>
		<footer class="modal-footer {parent.regionFooter}">
			<button type="button" class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button type="button" class="btn {parent.buttonPositive}" on:click={onOkClick}>OK</button>
		</footer>
	</div>
{/if}
