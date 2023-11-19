<script lang="ts">
	import Icon from '@iconify/svelte';

	let variant = 'variant-ghost-primary';
	let className = '';
	export { className as class };
	export let name: string | undefined = undefined;
	export let id: string | undefined = undefined;
	export let disabled: boolean | undefined = undefined;
	export let type: HTMLButtonElement['type'] = 'submit';

	async function onClick(e: Event) {
		if (type === 'button') {
			const elemForm = (e.target as Element).closest('form');
			if (elemForm) {
				// formDataに含めるため、新たにsubmit buttonを生成
				const elemButton = window.document.createElement('button');
				if (name) elemButton.name = name;
				elemForm.appendChild(elemButton);
				elemButton.click();
				elemForm.removeChild(elemButton);
			}
		}
	}
</script>

<button {type} {id} {name} on:click={onClick} class="btn {variant} {className}" {disabled}>
	{#if $$slots.default}
		<slot />
	{:else}
		<span><Icon icon="mdi:check" height="auto" /></span>
		<span>Save</span>
	{/if}
</button>
