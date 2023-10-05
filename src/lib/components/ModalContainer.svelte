<script lang="ts">
	export let title: string = '';
</script>

<div class="border-surface-200-700-token w-modal-slim mx-auto px-4">
	{#if title}
		<h2 class="h2 mb-4 text-center">{title}</h2>
	{/if}
	<slot />
</div>
