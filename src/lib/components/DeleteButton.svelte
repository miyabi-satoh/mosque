<script lang="ts">
	import Icon from '@iconify/svelte';

	let className = 'variant-ghost-warning btn';
	export { className as class };
	export let id: string | undefined = undefined;
	export let name = 'delete';
	export let disabled: boolean | undefined = undefined;
	export let message = 'Are you sure you want to delete this';
	export let item = 'item';
	export let type: HTMLButtonElement['type'] = 'button';

	async function onClick(e: Event) {
		if (!confirm(`${message}${item ? ' ' + item : ''}?`)) {
			e.preventDefault();
		} else if (type === 'button') {
			const elemForm = (e.target as Element).closest('form');
			if (elemForm) {
				// formDataに含めるため、新たにsubmit buttonを生成
				const elemButton = window.document.createElement('button');
				elemButton.name = name;
				elemForm.appendChild(elemButton);
				elemButton.click();
				elemForm.removeChild(elemButton);
			}
		}
	}
</script>

<button {type} {id} {name} on:click={onClick} class={className} {disabled}>
	{#if $$slots.default}
		<slot />
	{:else}
		<span><Icon icon="mdi:delete" height="auto" /></span>
		<span>Delete</span>
	{/if}
</button>
