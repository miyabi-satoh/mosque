<script lang="ts">
	export let error = false;
</script>

<div class="text-sm p-1 min-h-[28px]" class:text-error={error}><slot /></div>
