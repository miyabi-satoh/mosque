<script lang="ts">
	import type { Event } from '@prisma/client';
	import { addMinutes, format } from 'date-fns';

	export let data: (Event | null)[];

	function timeString(time: Date) {
		return format(addMinutes(time, time.getTimezoneOffset()), 'H:mm');
	}
</script>

{#each data as schedule (schedule?.id)}
	<div class="flex flex-row">
		{#if schedule?.start}
			<div class="w-10 text-right mr-1">{timeString(schedule.start)}</div>
		{/if}
		{#if schedule?.start || schedule?.end}
			<div>〜</div>
		{/if}
		{#if schedule?.end}
			<div class="w-10 text-right">{timeString(schedule.end)}</div>
		{/if}
		<div class="mx-2">{schedule?.name}</div>
	</div>
{/each}
