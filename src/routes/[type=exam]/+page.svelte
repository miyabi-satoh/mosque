<script lang="ts">
	import { AudioPlayer } from '$lib';
	import { submittingStore } from '$lib/stores';
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte';
	import type { PageData } from './$types';

	type CsvDataArrayT = PageData['csvData'];
	type CsvDataT = CsvDataArrayT[0];
	type ResourceT = CsvDataT & { url: string };

	export let data: PageData;
	let audioSrc: string = '';
	let audioTitle: string = '';
	let audioPaused: boolean = true;

	let selectedGrade = '';
	let selectedYear = '';
	let selectedNumOf = '';

	function filterByGrade(src: CsvDataArrayT, grade: string) {
		if (!grade) {
			return src;
		}
		return src.filter((obj) => `${obj.grade.value}` === grade);
	}
	function filterByYear(src: CsvDataArrayT, year: string) {
		if (!year) {
			return src;
		}
		return src.filter((obj) => `${obj.year.value}` === year);
	}
	function filterByNumOf(src: CsvDataArrayT, numOf: string) {
		if (!numOf) {
			return src;
		}
		return src.filter((obj) => `${obj.numOf.value}` === numOf);
	}

	function getGradeList(year: string, numOf: string) {
		const filtered = filterByYear(filterByNumOf(data.csvData, numOf), year);
		const map = new Map<number, string>();
		filtered.forEach((obj) => {
			if (map.get(obj.grade.value) === undefined) {
				map.set(obj.grade.value, obj.grade.label);
			}
		});
		const keys = [...map.keys()].sort((a, b) => a - b);
		return keys.map((key) => [`${key}`, map.get(key)]);
	}

	function getYearList(grade: string, numOf: string) {
		const filtered = filterByGrade(filterByNumOf(data.csvData, numOf), grade);
		const map = new Map<number, string>();
		filtered.forEach((obj) => {
			if (map.get(obj.year.value) === undefined) {
				map.set(obj.year.value, obj.year.label);
			}
		});
		const keys = [...map.keys()].sort((a, b) => b - a);
		return keys.map((key) => [`${key}`, map.get(key)]);
	}

	function getNumOfList(grade: string, year: string) {
		const filtered = filterByGrade(filterByYear(data.csvData, year), grade);
		const map = new Map<number, string>();
		filtered.forEach((obj) => {
			if (map.get(obj.numOf.value) === undefined) {
				map.set(obj.numOf.value, obj.numOf.label);
			}
		});
		const keys = [...map.keys()].sort((a, b) => b - a);
		return keys.map((key) => [`${key}`, map.get(key)]);
	}

	async function handleClickPlayPause(res: ResourceT) {
		if (audioSrc === res.url) {
			audioPaused = !audioPaused;
		} else {
			audioPaused = true;
			await tick();
			audioSrc = res.url;
			audioTitle = res.title;
			audioPaused = false;
		}
	}

	let resources: ResourceT[] = [];
	$: if (selectedGrade && selectedYear && selectedNumOf) {
		updateResources();
	}
	async function updateResources() {
		$submittingStore = true;
		resources = [];
		await tick();

		const newResources = data.csvData
			.filter(
				(obj) =>
					`${obj.grade.value}` === selectedGrade &&
					`${obj.year.value}` === selectedYear &&
					`${obj.numOf.value}` === selectedNumOf
			)
			.map((obj) => {
				return {
					...obj,
					url: `/api/data/${data.exam.examType}/${obj.id}`
				};
			});

		for (const obj of newResources) {
			try {
				const res = await fetch(obj.url);
				if (res.ok) {
					continue;
				} else {
					console.log(res.statusText);
				}
			} catch (err) {
				if (err instanceof Error) {
					console.log(err.message);
				}
			}
			obj.url = '';
		}
		resources = newResources;
		$submittingStore = false;
	}

	function handleClearClick() {
		selectedGrade = selectedYear = selectedNumOf = '';
		resources = [];
		audioPaused = true;
		audioSrc = audioTitle = '';
	}
</script>

<main class="container mx-auto flex max-w-3xl flex-1 flex-col overflow-y-hidden">
	<h1 class="p-4 text-4xl font-semibold">
		{data.exam?.fullName}<span class="ml-4">音声配信</span>
	</h1>

	<AudioPlayer src={audioSrc} title={audioTitle} bind:paused={audioPaused} />

	<div class="flex flex-col gap-4 p-4 sm:flex-row sm:justify-between">
		<select id="select-grade" bind:value={selectedGrade} class="select w-full">
			<option value="" disabled selected>{data.exam.labelGrade}</option>
			{#each getGradeList(selectedYear, selectedNumOf) as [value, label]}
				<option {value}>{label}</option>
			{/each}
		</select>

		<select id="select-year" bind:value={selectedYear} class="select w-full">
			<option value="" disabled selected>年度</option>
			{#each getYearList(selectedGrade, selectedNumOf) as [value, label]}
				<option {value}>{label}</option>
			{/each}
		</select>

		<select id="select-numof" bind:value={selectedNumOf} class="select w-full">
			<option value="" disabled selected>{data.exam.labelNumOf}</option>
			{#each getNumOfList(selectedGrade, selectedYear) as [value, label]}
				<option {value}>{label}</option>
			{/each}
		</select>

		<button class="variant-filled btn" on:click={handleClearClick}>Clear</button>
	</div>

	<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
		{#each resources as res}
			<div class="card border-surface-200-700-token w-full border p-4">
				<div class="flex items-center">
					<h2 class="flex-1">{res.title}</h2>
					<div>
						{#if res.category < 10}
							<button
								on:click={() => handleClickPlayPause(res)}
								disabled={!res.url}
								class:variant-filled-primary={audioSrc.endsWith(res.url)}
								class:variant-filled-secondary={!audioSrc.endsWith(res.url)}
								class="btn"
							>
								<Icon
									icon={audioSrc.endsWith(res.url) && !audioPaused ? 'mdi:pause' : 'mdi:play'}
									height="auto"
								/>
							</button>
						{:else if res.url}
							<button class="variant-filled-secondary btn">
								<a href={res.url} target="_blank">新しいタブで開く</a>
							</button>
						{:else}
							<button disabled class="variant-filled-secondary btn"> 新しいタブで開く </button>
						{/if}
					</div>
				</div>
				{#if !res.url}
					<div class="text-error-500">ファイルにアクセスできません。</div>
				{/if}
			</div>
		{/each}
	</div>
</main>
