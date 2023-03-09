<script lang="ts">
	export let id: string;
	export let name: string | undefined = undefined;
	export let maxlength: number | undefined = undefined;
	export let required = false;
	export let value: string = '';
	export let errorMessage: string | undefined = undefined;
	export let type: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url' = 'text';

	const handleInput = (event: Event) => {
		value = (event.target as HTMLInputElement).value;
	};
</script>

<input
	class="input input-bordered w-full"
	{id}
	{name}
	{type}
	{maxlength}
	{required}
	{value}
	on:input={handleInput}
/>
{#if errorMessage}
	<div class="bg-error text-error-content mt-1 px-2 rounded">{errorMessage}</div>
{/if}
