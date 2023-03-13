<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';

	export let id: string = uuidv4();
	export let name: string | undefined = undefined;
	export let minlength: number | undefined = undefined;
	export let maxlength: number | undefined = undefined;
	export let required = false;
	export let disabled = false;
	export let value: string | null | undefined = '';
	export let errorMessage: string | undefined = undefined;
	export let type: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url' = 'text';

	const handleInput = (event: Event) => {
		value = (event.target as HTMLInputElement).value;
	};
</script>

<div class="flex flex-col">
	<label for={id} class="label label-text">
		<slot />
	</label>
	<input
		class="input input-bordered w-full"
		{id}
		{name}
		{type}
		{minlength}
		{maxlength}
		{required}
		{disabled}
		{value}
		on:input={handleInput}
	/>
	{#if errorMessage}
		<div class="bg-error text-error-content mt-1 px-2 rounded">{errorMessage}</div>
	{/if}
</div>
