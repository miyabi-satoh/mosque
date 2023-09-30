<script lang="ts">
	export let title: string = '';
</script>

<div class="border-surface-200-700-token w-modal-slim mx-auto rounded-3xl border p-6 shadow-2xl">
	{#if title}
		<h2 class="h2 text-center">{title}</h2>
	{/if}
	<slot />
</div>
