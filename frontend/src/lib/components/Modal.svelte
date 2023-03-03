<script lang="ts" context="module">
	export const toggleModal = (id: string) => {
		window.document.getElementById(id)?.click();
	};
</script>

<script lang="ts">
	import Portal from 'svelte-portal';
	import { ID_MODALS } from '$lib/constants';
	// import { createEventDispatcher } from 'svelte';

	export let id: string;
	export let closeButton = true;
	let className = '';
	export { className as class };

	// const dispatch = createEventDispatcher();

	// const handleChange = (event) => {
	// 	console.log(event);
	// };
</script>

<Portal target="#{ID_MODALS}">
	<input type="checkbox" {id} class="modal-toggle" on:change />
	<label for={id} class="modal cursor-pointer">
		<label for="" class="modal-box relative {className}">
			{#if closeButton}
				<label for={id} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
			{/if}
			<slot />
		</label>
	</label>
</Portal>
