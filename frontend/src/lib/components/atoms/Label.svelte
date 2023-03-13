<script lang="ts">
	let labelFor: string | undefined = undefined;
	export { labelFor as for };
</script>

{#if $$slots.default}
	<label for={labelFor} class="label label-text">
		<slot />
	</label>
{/if}
