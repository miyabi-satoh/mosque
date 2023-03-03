<script lang="ts">
	export let id: string;
	export let name: string;
	export let maxlength: number | undefined = undefined;
	export let required = false;
	export let value: string | null | undefined = undefined;
	export let errorMessage: string | undefined = undefined;
	export let type: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url' = 'text';
</script>

<input class="input input-bordered w-full" {id} {name} {type} {maxlength} {value} {required} />
{#if errorMessage}
	<div class="bg-error text-error-content mt-1 px-2 rounded">{errorMessage}</div>
{/if}
