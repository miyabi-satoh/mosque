<script lang="ts">
	import type { Event } from '@prisma/client';
	import { addMinutes, format } from 'date-fns';

	export let data: (Event | null)[];

	function timeString(time: Date) {
		return format(addMinutes(time, time.getTimezoneOffset()), 'H:mm');
	}
</script>

{#each data as schedule (schedule?.id)}
	<div class="flex gap-2">
		{#if schedule?.start || schedule?.end}
			<div class="flex flex-none gap-1">
				{#if schedule?.start}
					<div class="w-10 text-right">{timeString(schedule.start)}</div>
				{/if}
				<div>〜</div>
				{#if schedule?.end}
					<div class="w-10 text-right">{timeString(schedule.end)}</div>
				{/if}
			</div>
		{/if}
		<div>{schedule?.name}</div>
	</div>
{/each}
