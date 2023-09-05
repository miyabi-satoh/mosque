<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import AudioPlayer from '$lib/AudioPlayer.svelte';
	import { tick } from 'svelte';

	export let data: PageData;
	let audioSrc: string = '';
	let audioTitle: string = '';
	let audioPaused: boolean = true;

	let selectedGrade = '';
	let yearMap = new Map<string, string>();
	function handleChangeGrade() {
		selectedYear = '';
		yearMap.clear();
		selectedMonth = '';
		monthMap.clear();

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
	let monthMap = new Map<string, string>();
	function handleChangeYear() {
		selectedMonth = '';
		monthMap.clear();

		const monthSet = new Set<number>();
		data.csvData
			.filter((obj) => obj.grade === selectedGrade && obj.year === selectedYear)
			.map((obj) => Number(obj.month))
			// 1〜3月を13〜15月として処理
			.forEach((m) => monthSet.add(m < 4 ? m + 12 : m));
		// 数値昇順でソート
		[...monthSet]
			.sort((a, b) => a - b)
			.forEach((m) => {
				// 13〜15月を1〜3月に戻す
				if (m > 12) m -= 12;
				monthMap.set(`${m}`, `${m}月号`);
			});
		monthMap = monthMap;
	}

	let selectedMonth = '';

	type TrackT = {
		src: string;
		title: string;
	};
	let tracks: TrackT[] = [];

	async function handleChangeMonth() {
		tracks = [
			{
				src: await getMediaUrl('J'),
				title: '国語&emsp;聞き取り問題'
			},
			{
				src: await getMediaUrl('E'),
				title: '英語&emsp;リスニング問題'
			}
		];
		console.log(tracks);
	}

	async function getMediaUrl(subj: 'J' | 'E') {
		const key = `${selectedYear},${selectedGrade},${selectedMonth},${subj},`;
		const url = `/data?key=${encodeURIComponent(key)}`;
		const res = await fetch(url);
		if (res.ok) {
			return url;
		}
		return '';
	}

	async function handleClickPlayPause(track: TrackT) {
		if (audioSrc === track.src) {
			audioPaused = !audioPaused;
		} else {
			audioPaused = true;
			await tick();
			audioSrc = track.src;
			audioTitle = track.title;
			audioPaused = false;
		}
	}
</script>

<main class="container mx-auto max-w-3xl flex-1">
	<h1 class="p-4 text-4xl font-semibold">Ｃテスト音声配信サービス</h1>
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
		<select
			id="select-grade"
			bind:value={selectedGrade}
			on:change={handleChangeGrade}
			class="select select-bordered w-full"
		>
			<option value="" disabled selected>学年</option>
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
			id="select-month"
			bind:value={selectedMonth}
			on:change={handleChangeMonth}
			class="select select-bordered w-full"
		>
			<option value="" disabled selected>月号</option>
			{#each [...monthMap.keys()] as key}
				<option value={key}>{monthMap.get(key)}</option>
			{/each}
		</select>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
		{#each tracks as track}
			<div class="card bg-base-200 dark:bg-neutral/25 border border-base-content/20 rounded w-full">
				<div class="card-body p-4 justify-between">
					<h2 class="card-title">
						<!-- eslint-disable-next-line -->
						{@html track.title}
					</h2>
					<div class="card-actions justify-center mt-4">
						<button
							on:click={() => handleClickPlayPause(track)}
							disabled={!track.src}
							class:btn-outline={!audioSrc.endsWith(track.src)}
							class="btn btn-sm btn-info rounded-3xl w-16"
						>
							<Icon
								icon={audioSrc.endsWith(track.src) && !audioPaused ? 'mdi:pause' : 'mdi:play'}
								height="auto"
							/>
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<AudioPlayer src={audioSrc} title={audioTitle} bind:paused={audioPaused} />
</main>
