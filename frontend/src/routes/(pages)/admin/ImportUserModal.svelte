<script lang="ts">
	import Dropzone from '$lib/components/Dropzone.svelte';
	import Modal, { closeModal } from '$lib/components/Modal.svelte';

	export let modalId: string;
	let textData: string | undefined;
	let selectedFiles: FileList | undefined;
	let errorMessage: string | undefined;

	const handleEscKey = (event: KeyboardEvent) => {
		if (event.key == 'Escape') {
			closeModal(modalId);
		}
	};

	$: if (selectedFiles) {
		setPreview(selectedFiles);
	}
	const setPreview = async (files: FileList) => {
		const file = files[0];
		if (file) {
			textData = await file.text();
		}
	};
</script>

<Modal id={modalId} class="w-2/3 {textData ? 'max-w-2xl' : ''}">
	<h4 class="my-0">インポート</h4>
	<form on:keyup={handleEscKey}>
		{#if selectedFiles && selectedFiles.length > 0}
			<p class="my-0">{selectedFiles[0].name}</p>
			{#if textData !== undefined}
				<pre class="my-0 h-[40vh] overflow-scroll">{textData}</pre>
			{/if}
			{#if errorMessage}
				<div class="my-4 p-2 bg-error text-error-content">
					{errorMessage}
				</div>
			{/if}
			<div class="flex items-center justify-between w-full mt-4">
				<button
					class="btn btn-default"
					on:click|preventDefault={() => {
						textData = undefined;
						selectedFiles = undefined;
					}}>再選択</button
				>
				<button class="btn btn-primary">インポート</button>
			</div>
		{:else}
			<div class="not-prose flex items-center justify-center w-full mt-4">
				<Dropzone id="selected-file" name="file" accept=".json" bind:files={selectedFiles} />
			</div>
		{/if}
	</form>
</Modal>
