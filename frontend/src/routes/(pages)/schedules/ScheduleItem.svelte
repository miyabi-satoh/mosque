<script lang="ts">
	import { format, parse } from 'date-fns';

	export let start: string | null;
	export let end: string | null;
	export let name: string;
</script>

<div class="flex flex-row">
	{#if start}
		<div class="w-10 text-right mr-1">{format(parse(start, 'HH:mm:ss', new Date()), 'H:mm')}</div>
	{/if}
	{#if start || end}
		<div>〜</div>
	{/if}
	{#if end}
		<div class="w-10 text-right">{format(parse(end, 'HH:mm:ss', new Date()), 'H:mm')}</div>
	{/if}
	<div class="mx-2">{name}</div>
</div>
