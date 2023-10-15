<script lang="ts">
	
let className = 'variant-ghost-warning btn';
	export { className as class };
	export let id: string | undefined = undefined;
	export let name = 'delete';
	export let disabled: boolean | undefined = undefined;
	export let message = 'Are you sure you want to delete this';
	export let item = 'item';
	export let type: HTMLButtonElement['type'] = 'button';

	let elemButton: HTMLButtonElement;
	async function onClick(e: Event) {
		if (!confirm(`${message}${item ? ' ' + item : ''}?`)) {
			e.preventDefault();
		} else {
			const elemForm = (e.target as Element).closest('form');
			if (elemForm) {
				const elemButton = window.document.createElement('button');
				elemButton.name = 'delete';
				elemForm.appendChild(elemButton);
				elemButton.click();
				elemForm.removeChild(elemButton);
			}
		}
	}
</script>

<button {type} {id} {name} bind:this={elemButton} on:click={onClick} class={className} {disabled}>
	{#if $$slots.default}
		<slot />
	{:else}
		Delete
	{/if}
</button>
