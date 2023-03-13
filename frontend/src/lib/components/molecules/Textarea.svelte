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
</script>

<div class="flex flex-col">
	<label for={id} class="label label-text">
		<slot />
	</label>
	<textarea
		class="textarea textarea-bordered w-full"
		{id}
		{name}
		{minlength}
		{maxlength}
		{required}
		{disabled}
		{value}
	/>
	{#if errorMessage}
		<div class="bg-error text-error-content mt-1 px-2 rounded">{errorMessage}</div>
	{/if}
</div>
