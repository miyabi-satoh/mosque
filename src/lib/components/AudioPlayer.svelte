<script lang="ts">
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte';

	export let src: string;
	export let title: string;
	export let paused: boolean = true;

	let time = 0;
	let duration = 0;

	function format(t: number) {
		if (isNaN(t)) return '...';

		const minutes = Math.floor(t / 60);
		const seconds = Math.floor(t % 60);

		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	}

	function handleInputRange(event: Event) {
		const target = event.target as HTMLInputElement;
		time = Number(target.value);
	}

	function handleChangeRange(event: Event) {
		const target = event.target as HTMLInputElement;
		time = Number(target.value);
	}

	$: if (time >= 0) {
		updateRangeBackground();
	}
	async function updateRangeBackground() {
		if (browser) {
			await tick();
			const e = window.document.getElementById('range-audio') as HTMLInputElement;
			if (e) {
				const min = Number(e.min);
				const max = Number(e.max);
				const val = Number(e.value);
				if (max - min > 0) {
					e.style.backgroundSize = ((val - min) * 100) / (max - min) + '% 100%';
				} else {
					e.style.backgroundSize = '0% 100%';
				}
			}
		}
	}

	$: disabled = !src;
	$: if (disabled) {
		time = duration = 0;
		updateRangeBackground();
	}
</script>

<div class="flex flex-col items-center gap-x-4 sm:flex-row">
	<audio
		{src}
		bind:currentTime={time}
		bind:duration
		bind:paused
		on:ended={() => {
			time = 0;
		}}
	/>

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
			value={time}
			on:input={handleInputRange}
			on:change={handleChangeRange}
			min="0"
			max={duration}
			class="w-full"
		/>
	</div>
</div>

<style lang="postcss">
	input[type='range'] {
		@apply bg-surface-400-500-token h-2 rounded bg-no-repeat;
		appearance: none;
		background-image: linear-gradient(#38bdf8, #38bdf8);
		background-size: 0% 100%;
		box-shadow: 0px 1px 1px rgba(255, 255, 255, 0.06);
	}

	input[type='range']::-webkit-slider-thumb,
	input[type='range']::-moz-range-thumb,
	input[type='range']::-ms-thumb {
		@apply h-6 w-6 cursor-ew-resize rounded-[50%];
		-webkit-appearance: none;
		appearance: none;
		-moz-appearance: none;
		box-shadow:
			0px 1px 3px rgba(0, 0, 0, 0.1),
			0px 1px 2px rgba(0, 0, 0, 0.06);
		-webkit-transition: background 0.3s ease-in-out;
		transition: background 0.3s ease-in-out;
	}

	input[type='range']::-webkit-slider-runnable-track,
	input[type='range']::-moz-range-track,
	input[type='range']::-ms-track {
		@apply border-none bg-transparent shadow-none;
		-webkit-appearance: none;
		appearance: none;
		-moz-appearance: none;
	}
</style>
