<script lang="ts">
	import Icon from '@iconify/svelte';

	export let href: string;
	export let icon: string;
	export let iconHeight = 20;
	let className = 'btn-primary';
	export { className as class };
</script>

<a {href} class="btn gap-2 {className}" on:click>
	<Icon {icon} height={iconHeight} />
	{#if $$slots.default}
		<span><slot /></span>
	{/if}
</a>
