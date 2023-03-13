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
	export let error = false;
</script>

<div class="flex flex-col">
	<Label for={id}><slot /></Label>
	<textarea
		class="textarea textarea-bordered w-full"
		class:textarea-error={error}
		{id}
		{name}
		{minlength}
		{maxlength}
		{required}
		{disabled}
		bind:value
	/>
	<HelperText {error}>{helperText ?? ''}</HelperText>
</div>
