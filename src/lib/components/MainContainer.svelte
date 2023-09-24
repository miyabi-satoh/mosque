<script lang="ts">
	type DisplayEnum = 'block' | 'flex' | 'grid';
	export let display: DisplayEnum = 'flex';
	export let innerScroll = false;
</script>

<main
	class="container mx-auto flex-1 lg:max-w-3xl"
	class:flex={display === 'flex'}
	class:flex-col={display === 'flex'}
	class:overflow-y-hidden={innerScroll}
>
	<slot />
</main>
