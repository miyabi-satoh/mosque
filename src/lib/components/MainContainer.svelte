<script lang="ts">
	type DisplayEnum = 'block' | 'flex' | 'grid';
	export let display: DisplayEnum = 'flex';
	export let innerScroll: boolean = false;
</script>

<main
	class="container mx-auto flex-1 lg:max-w-3xl"
	class:flex={display === 'flex' || innerScroll}
	class:flex-col={display === 'flex' || innerScroll}
	class:overflow-y-hidden={innerScroll}
>
	<slot />
</main>
