<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import HelperText from '../atoms/HelperText.svelte';
	import Label from '../atoms/Label.svelte';

	export let id: string = uuidv4();
	export let name: string | undefined = undefined;
	export let minlength: number | undefined = undefined;
	export let maxlength: number | undefined = undefined;
	export let required = false;
	export let disabled = false;
	export let value: string | null | undefined = '';
	export let helperText: string | undefined = undefined;
	export let type: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url' = 'text';
	export let error = false;

	const handleInput = (event: Event) => {
		value = (event.target as HTMLInputElement).value;
	};
</script>

<div class="flex flex-col">
	<Label for={id}><slot /></Label>
	<input
		class="input input-bordered w-full"
		class:input-error={error}
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
	<HelperText {error}>{helperText ?? ''}</HelperText>
</div>
