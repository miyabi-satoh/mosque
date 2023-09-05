<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let data: PageData;

	let selectedGrade = '';
	let yearMap = new Map<string, string>();
	function handleChangeGrade() {
		selectedYear = '';
		yearMap.clear();
		selectedKai = '';
		kaiMap.clear();

		const yearSet = new Set<number>();
		data.csvData
			.filter((obj) => obj.grade === selectedGrade)
			.forEach((obj) => yearSet.add(Number(obj.year)));
		// 数値降順でソート
		[...yearSet]
			.sort((a, b) => b - a)
			.forEach((y) => {
				yearMap.set(`${y}`, `${y}年度`);
			});
		yearMap = yearMap;
	}

	let selectedYear = '';
	let kaiMap = new Map<string, string>();
	function handleChangeYear() {
		selectedKai = '';
		kaiMap.clear();

		const kaiSet = new Set<number>();
		data.csvData
			.filter((obj) => obj.grade === selectedGrade && obj.year === selectedYear)
			.forEach((obj) => kaiSet.add(Number(obj.kai)));
		// 数値昇順でソート
		[...kaiSet]
			.sort((a, b) => a - b)
			.forEach((k) => {
				kaiMap.set(`${k}`, `第${k}回`);
			});
		kaiMap = kaiMap;
	}

	let selectedKai = '';
	let mediaUrls = new Map<string, string>();

	async function handleChangeKai() {
		mediaUrls.clear();
		// 問題
		let url = await getMediaUrl('Q');
		if (url) {
			mediaUrls.set('問題冊子', url);
		}
		// 解答
		url = await getMediaUrl('A');
		if (url) {
			mediaUrls.set('解答', url);
		}
		// リスニング音源
		const medias = data.csvData
			.filter((obj) => {
				return (
					obj.year === selectedYear &&
					obj.kai === selectedKai &&
					obj.grade === selectedGrade &&
					obj.type.toLowerCase().startsWith('part')
				);
			})
			.sort(
				(a, b) =>
					Number(a.type.toLowerCase().replace('part', '')) -
					Number(b.type.toLowerCase().replace('part', ''))
			);

		for (const media of medias) {
			url = await getMediaUrl(media.type);
			if (url) {
				mediaUrls.set(`リスニング音源（${media.type}）`, url);
			}
		}
		mediaUrls = mediaUrls;
	}

	async function getMediaUrl(type: string): Promise<string> {
		const key = `${selectedYear},${selectedKai},${selectedGrade},${type},`;
		const url = `/data-eiken?key=${encodeURIComponent(key)}`;
		const res = await fetch(url);
		if (res.ok) {
			return url;
		}
		return '';
	}

	let audio: HTMLAudioElement;
	let currentTime = 0;
	let remainTime = 0;
	let duration = 0;

	onMount(() => {
		audio.autoplay = false;
		audio.loop = false;
		audio.muted = false;
		audio.playbackRate = 1.0;
		audio.preload = 'metadata';
		audio.volume = 1.0;
		audio.addEventListener('loadedmetadata', () => {
			duration = Math.floor(audio.duration);
			remainTime = duration;
		});
		audio.addEventListener('ended', () => {
			audio.currentTime = 0;
			pauseAudio();
			updateTime();
		});
	});

	function handleClickPlayPause(url: string) {
		if (audio.src.endsWith(url)) {
			// 再生中だったら停止
			if (!audio.paused) {
				pauseAudio();
			} else {
				playAudio();
			}
		} else if (url !== '') {
			// 再生中だったら停止
			if (!audio.paused) {
				pauseAudio();
			}
			audio.src = url;
			playAudio();
		}
		audio = audio;
	}

	let audioError = '';
	let timerId = 0;
	let seeking = false;

	function onInterval() {
		clearInterval(timerId);
		timerId = window.setInterval(() => {
			if (audio && !seeking) {
				updateTime();
			}
		}, 500);
	}

	async function playAudio() {
		if (audio) {
			audioError = '';
			try {
				await audio.play();
				onInterval();
			} catch (err) {
				if (err instanceof Error) {
					audioError = err.message;
				} else {
					audioError = 'Unexpected error';
				}
			}
		}
	}

	function pauseAudio() {
		if (audio && !audio.paused) {
			audio.pause();
			clearInterval(timerId);
		}
	}

	onDestroy(() => {
		pauseAudio();
	});

	function handleClickSkipHead() {
		audio.currentTime = 0;
		updateTime();
	}

	function handleClickSkipBack() {
		audio.currentTime -= 10;
		updateTime();
	}

	function handleClickSkipForward() {
		audio.currentTime += 10;
		updateTime();
	}

	function handleInputRange(event: Event) {
		seeking = true;
		const target = event.target as HTMLInputElement;
		currentTime = Number(target.value);
	}

	function handleChangeRange(event: Event) {
		console.log(`handleChangeRange`);
		const target = event.target as HTMLInputElement;
		audio.currentTime = Number(target.value);
		updateTime();
		seeking = false;
	}

	function updateTime() {
		currentTime = Math.floor(audio.currentTime);
	}

	function formatTime(sec: number) {
		const m = Math.floor(sec / 60);
		const s = Math.floor(sec - m * 60);
		return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	}

	$: if (browser && currentTime !== undefined) {
		remainTime = duration - currentTime;
		const e = window.document.getElementById('range-audio') as HTMLInputElement;
		if (e) {
			const min = Number(e.min);
			const max = Number(e.max);
			const val = Number(currentTime);

			e.style.backgroundSize = ((val - min) * 100) / (max - min) + '% 100%';
		}
	}
</script>

<main class="container mx-auto max-w-3xl flex-1">
	<h1 class="p-4 text-4xl font-semibold">英検過去問配信サービス</h1>
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
		<select
			id="select-grade"
			bind:value={selectedGrade}
			on:change={handleChangeGrade}
			class="select select-bordered w-full"
		>
			<option value="" disabled selected>級</option>
			{#each [...data.grades.keys()] as key}
				<option value={key}>{data.grades.get(key)}</option>
			{/each}
		</select>

		<select
			id="select-year"
			bind:value={selectedYear}
			on:change={handleChangeYear}
			class="select select-bordered w-full"
		>
			<option value="" disabled selected>年度</option>
			{#each [...yearMap.keys()] as key}
				<option value={key}>{yearMap.get(key)}</option>
			{/each}
		</select>

		<select
			id="select-kai"
			bind:value={selectedKai}
			on:change={handleChangeKai}
			class="select select-bordered w-full"
		>
			<option value="" disabled selected>実施回</option>
			{#each [...kaiMap.keys()] as key}
				<option value={key}>{kaiMap.get(key)}</option>
			{/each}
		</select>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
		{#each [...mediaUrls.entries()] as [key, url]}
			<div class="card bg-base-200 dark:bg-neutral/25 border border-base-content/20 rounded w-full">
				<div class="card-body p-4 justify-between">
					<h2 class="card-title">{key}</h2>
					<div class="card-actions justify-center mt-4">
						{#if key.toLowerCase().includes('part')}
							<button
								on:click={() => handleClickPlayPause(url)}
								disabled={!url}
								class="btn btn-sm btn-info rounded-3xl w-16 {audio && audio.src.endsWith(url)
									? ''
									: 'btn-outline'}"
							>
								{#if audio && audio.src.endsWith(url) && !audio.paused}
									<Icon icon="mdi:pause" height="auto" />
								{:else}
									<Icon icon="mdi:play" height="auto" />
								{/if}
							</button>
						{:else}
							<a href={url} target="_blank" class="btn btn-primary">新しいタブで開く</a>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<div class="p-4">
		{#if audioError}
			<div class="alert alert-error">
				<Icon icon="mdi:close-circle-outline" height="auto" />
				<span>{audioError}</span>
			</div>
		{/if}
	</div>

	<audio bind:this={audio} />
	{#if audio && audio.src}
		<div class="flex p-4 gap-4 items-center">
			<button class="btn btn-square btn-ghost" on:click={handleClickSkipHead}>
				<Icon icon="mdi:skip-previous" height="48px" />
			</button>
			<button class="btn btn-square btn-ghost" on:click={handleClickSkipBack}>
				<Icon icon="fluent:skip-back-10-32-regular" height="32px" />
			</button>
			<button
				on:click={() => handleClickPlayPause(audio.src)}
				class="btn btn-circle btn-info h-16 w-16"
			>
				{#if !audio.paused}
					<Icon icon="mdi:pause" height="64px" />
				{:else}
					<Icon icon="mdi:play" height="64px" />
				{/if}
			</button>
			<button class="btn btn-square btn-ghost" on:click={handleClickSkipForward}>
				<Icon icon="fluent:skip-forward-10-32-regular" height="32px" />
			</button>
			<div class="flex flex-col flex-1">
				<div class="flex justify-between">
					<span>{formatTime(currentTime)}</span>
					<span>{formatTime(remainTime)}</span>
				</div>
				<input
					id="range-audio"
					type="range"
					value={currentTime}
					on:input={handleInputRange}
					on:change={handleChangeRange}
					min="0"
					max={duration}
					class="w-full"
				/>
			</div>
		</div>
	{/if}
</main>

<style>
	input[type='range'] {
		appearance: none;
		height: 8px;
		border-radius: 5px;
		background: #0f172a;
		background-image: linear-gradient(#38bdf8, #38bdf8);
		background-size: 0% 100%;
		box-shadow: 0px 1px 1px rgba(255, 255, 255, 0.06);
		background-repeat: no-repeat;
	}

	input[type='range']::-webkit-slider-thumb,
	input[type='range']::-moz-range-thumb,
	input[type='range']::-ms-thumb {
		-webkit-appearance: none;
		appearance: none;
		-moz-appearance: none;
		height: 24px;
		width: 24px;
		border-radius: 50%;
		background: #e2e8f0;
		cursor: ew-resize;
		box-shadow:
			0px 1px 3px rgba(0, 0, 0, 0.1),
			0px 1px 2px rgba(0, 0, 0, 0.06);
		-webkit-transition: background 0.3s ease-in-out;
		transition: background 0.3s ease-in-out;
	}

	input[type='range']::-webkit-slider-runnable-track,
	input[type='range']::-moz-range-track,
	input[type='range']::-ms-track {
		-webkit-appearance: none;
		appearance: none;
		-moz-appearance: none;
		box-shadow: none;
		border: none;
		background: transparent;
	}
</style>
