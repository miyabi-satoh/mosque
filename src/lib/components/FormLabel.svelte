<script lang="ts">
	export let text: string;
	export let constraint: Partial<{ required: boolean }> | undefined = undefined;
</script>

<label class="label">
	<div>
		<span class="font-semibold">{text}</span>
		{#if constraint && constraint.required}
			<span class="ml-0.5 font-semibold">*</span>
		{:else}
			<span class="text-xs opacity-50">(optional)</span>
		{/if}
	</div>
	<slot />
</label>
