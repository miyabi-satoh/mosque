<script lang="ts">
	import { page } from '$app/stores';

	type SizeEnum =
		| 'xs'
		| 'sm'
		| 'base'
		| 'lg'
		| 'xl'
		| '2xl'
		| '3xl'
		| '4xl'
		| '5xl'
		| '6xl'
		| '7xl'
		| '8xl'
		| '9xl';
	let classes = '';
	export { classes as class };
	export let usePageStatus = false;
	export let size: SizeEnum = 'sm';
</script>

<div
	class="text-{size} {classes}"
	class:text-error-500-400-token={!usePageStatus || $page.status >= 400}
>
	<slot />
</div>
