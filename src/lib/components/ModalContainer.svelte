<script lang="ts">
	export let title: string = '';
</script>

<div class="border-surface-200-700-token w-modal-slim mx-auto px-4">
	{#if title}
		<h1 class="h2 mb-4 text-center">{title}</h1>
	{/if}
	<slot />
</div>
