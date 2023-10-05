<script lang="ts">
	let classes: string = '';
	export { classes as class };
</script>

<div class="flex-1 overflow-y-scroll {classes}">
	<slot />
</div>
