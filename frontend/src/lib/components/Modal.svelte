<script lang="ts" context="module">
	import { browser } from '$app/environment';

	export const toggleModal = (id: string) => {
		if (browser) {
			window.document.getElementById(id)?.click();
		} else {
			console.error(`no window`);
		}
	};
	export const closeModal = (id: string) => {
		if (browser) {
			const el = window.document.getElementById(id);
			if (el) {
				(el as HTMLInputElement).checked = false;
			}
		} else {
			console.error(`no window`);
		}
	};
	export const showModal = (id: string) => {
		if (browser) {
			const el = window.document.getElementById(id);
			if (el) {
				(el as HTMLInputElement).checked = true;
			}
		} else {
			console.error(`no window`);
		}
	};
</script>

<script lang="ts">
	import Portal from 'svelte-portal';
	import { ID_MODALS } from '$lib/constants';

	export let id: string;
	export let closeButton = true;
	let className = '';
	export { className as class };
</script>

<Portal target="#{ID_MODALS}">
	<input type="checkbox" {id} class="modal-toggle" on:change on:keyup />
	<label for={id} class="modal cursor-pointer">
		<label for="" class="modal-box relative {className}">
			{#if closeButton}
				<label for={id} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
			{/if}
			<slot />
		</label>
	</label>
</Portal>
