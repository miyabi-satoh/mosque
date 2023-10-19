<script lang="ts">
	export let text: string;
	export let constraint: Partial<{ required: boolean }> | undefined = undefined;
</script>

<label class="label">
	<div class="font-semibold">
		<span class="mr-1">{text}</span>
		{#if constraint && constraint.required}
			<span>*</span>
		{:else}
			<span class="text-xs opacity-50">(optional)</span>
		{/if}
	</div>
	<slot />
</label>
