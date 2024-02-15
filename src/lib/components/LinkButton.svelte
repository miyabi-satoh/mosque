<script lang="ts">
	export let href: string;
	export let variant = 'variant-filled-secondary';
	let classes: string = '';
	export { classes as class };
</script>

<a {href} class="btn {variant} {classes}">
	<slot />
</a>
