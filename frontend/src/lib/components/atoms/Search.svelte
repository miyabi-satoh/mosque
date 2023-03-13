<script lang="ts">
	export let value: string | null | undefined;
</script>

<input
	bind:value
	type="search"
	placeholder="Search keywords..."
	class="input input-bordered w-full"
/>
