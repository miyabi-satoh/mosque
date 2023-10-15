<script lang="ts">
	let className = 'variant-ghost-warning btn';
	export { className as class };
	export let id: string | undefined = undefined;
	export let name = 'delete';
	export let disabled: boolean | undefined = undefined;
	export let message = 'Are you sure you want to delete this?';
</script>

<button
	{id}
	{name}
	on:click={(e) => !confirm(message) && e.preventDefault()}
	class={className}
	{disabled}
>
	<slot />
</button>
