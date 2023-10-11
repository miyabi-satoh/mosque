<script lang="ts">
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte';
	import './style.postcss';

	export let src: string;
	export let title: string;
	export let paused: boolean = true;

	let rangeEl: HTMLInputElement;
	let time = 0;
	let duration = 0;

	function format(t: number): string {
		if (isNaN(t)) return '...';

		const minutes = Math.floor(t / 60);
		const seconds = Math.floor(t % 60);

		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	}

	$: disabled = !src;
	$: if (disabled) {
		time = duration = 0;
	}
	$: if (time >= 0) {
		updateRangeBackground();
	}
	async function updateRangeBackground(): Promise<void> {
		if (rangeEl) {
			await tick();
			const min = Number(rangeEl.min);
			const max = Number(rangeEl.max);
			const val = Number(rangeEl.value);
			if (max - min > 0) {
				rangeEl.style.backgroundSize = ((val - min) * 100) / (max - min) + '% 100%';
			} else {
				rangeEl.style.backgroundSize = '0% 100%';
			}
		}
	}
</script>

<div class="flex flex-col items-center gap-x-4 sm:flex-row">
	<audio {src} bind:currentTime={time} bind:duration bind:paused on:ended={() => (time = 0)} />

	<div class="flex justify-center gap-x-4">
		<button {disabled} class="btn hidden px-2 sm:inline-flex" on:click={() => (time = 0)}>
			<Icon icon="mdi:skip-previous" height="32px" />
		</button>
		<button {disabled} class="btn px-2" on:click={() => (time -= 10)}>
			<Icon icon="fluent:skip-back-10-32-regular" height="32px" />
		</button>
		<button
			{disabled}
			class:variant-ghost={disabled}
			class:variant-ghost-primary={!disabled}
			class="btn rounded-full p-3"
			on:click={() => (paused = !paused)}
		>
			<Icon icon={paused ? 'mdi:play' : 'mdi:pause'} height="48px" />
		</button>
		<button {disabled} class="btn px-2" on:click={() => (time += 10)}>
			<Icon icon="fluent:skip-forward-10-32-regular" height="32px" />
		</button>
	</div>
	<div class="flex w-full flex-col gap-y-2">
		<div
			class="flex items-center justify-between gap-x-2"
			class:text-surface-400-500-token={disabled}
		>
			<span>{format(time)}</span>
			<span>{title}</span>
			<span>{format(duration - time)}</span>
		</div>
		<input
			{disabled}
			id="range-audio"
			type="range"
			bind:this={rangeEl}
			bind:value={time}
			min="0"
			max={duration}
			class="w-full"
		/>
	</div>
</div>
