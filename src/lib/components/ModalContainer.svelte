<script lang="ts">
	export let title: string = '';
</script>

<div class="border-surface-200-700-token w-modal-slim mx-auto rounded-3xl border p-6 shadow-2xl">
	{#if title}
		<h1 class="h1 text-center">{title}</h1>
	{/if}
	<slot />
</div>
