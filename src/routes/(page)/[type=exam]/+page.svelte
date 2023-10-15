<script lang="ts">
	import { AudioPlayer, HelperText, Scrollable, parentClass } from '$lib';
	import { URLS } from '$lib/consts';
	import { getExamConfig } from '$lib/exam';
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
	let selectedPublisher = '';

	function filterByGrade(src: CsvDataArrayT, grade: string) {
		if (!grade) {
			return src;
		}
		return src.filter((obj) => `${obj.grade}` === grade);
	}
	function filterByYear(src: CsvDataArrayT, year: string) {
		if (!year) {
			return src;
		}
		return src.filter((obj) => `${obj.year}` === year);
	}
	function filterByNumOf(src: CsvDataArrayT, numOf: string) {
		if (!numOf) {
			return src;
		}
		return src.filter((obj) => `${obj.numOf}` === numOf);
	}

	const config = getExamConfig(data.exam);
	function getGradeList(year: string, numOf: string) {
		const filtered = filterByYear(filterByNumOf(data.csvData, numOf), year);
		const map = new Map<number, string>();
		filtered.forEach((obj) => {
			if (map.get(obj.grade) === undefined) {
				map.set(obj.grade, config.labelGrade(obj.grade));
			}
		});
		const keys = [...map.keys()].sort((a, b) => a - b);
		return keys.map((key) => [`${key}`, map.get(key)]);
	}

	function getYearList(grade: string, numOf: string) {
		const filtered = filterByGrade(filterByNumOf(data.csvData, numOf), grade);
		const map = new Map<number, string>();
		filtered.forEach((obj) => {
			if (map.get(obj.year) === undefined) {
				map.set(obj.year, config.labelYear(obj.year));
			}
		});
		const keys = [...map.keys()].sort((a, b) => b - a);
		return keys.map((key) => [`${key}`, map.get(key)]);
	}

	function getNumOfList(grade: string, year: string) {
		const filtered = filterByGrade(filterByYear(data.csvData, year), grade);
		const map = new Map<number, string>();
		filtered.forEach((obj) => {
			if (map.get(obj.numOf) === undefined) {
				map.set(obj.numOf, config.labelNumOf(obj.numOf));
			}
		});
		const keys = [...map.keys()].sort((a, b) => b - a);
		return keys.map((key) => [`${key}`, map.get(key)]);
	}

	function getPublisherList(year: string) {
		const filtered = filterByYear(data.csvData, year);
		const set = new Set<string>();
		filtered.forEach((obj) => {
			if (!set.has(obj.publisher)) {
				set.add(obj.publisher);
			}
		});
		return set.entries();
	}

	async function onPlayPauseClick(res: ResourceT) {
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
	$: if (
		(selectedGrade || !config.columnLabels.grade) &&
		(selectedYear || !config.columnLabels.year) &&
		(selectedNumOf || !config.columnLabels.numOf) &&
		(selectedPublisher || !config.columnLabels.publisher)
	) {
		updateResources();
	}
	async function updateResources() {
		$submittingStore = true;
		resources = [];
		await tick();

		const newResources = data.csvData
			.filter(
				(obj) =>
					(!config.columnLabels.grade || `${obj.grade}` === selectedGrade) &&
					(!config.columnLabels.year || `${obj.year}` === selectedYear) &&
					(!config.columnLabels.numOf || `${obj.numOf}` === selectedNumOf) &&
					(!config.columnLabels.publisher || obj.publisher === selectedPublisher)
			)
			.map((obj) => {
				return {
					...obj,
					url: `${URLS.API_DATA}/${data.exam.examType}/${obj.id}`
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

	function onClearClick() {
		selectedGrade = selectedYear = selectedNumOf = '';
		resources = [];
		audioPaused = true;
		audioSrc = audioTitle = '';
	}
</script>

<div class="mx-4 space-y-8 {parentClass}">
	<div>
		<AudioPlayer src={audioSrc} title={audioTitle} bind:paused={audioPaused} />
	</div>

	<Scrollable class="space-y-4">
		<div class="flex flex-col gap-4 sm:flex-row sm:justify-between">
			{#if config.columnLabels.grade}
				<select id="select-grade" bind:value={selectedGrade} class="select">
					<option value="" disabled selected>{config.columnLabels.grade}</option>
					{#each getGradeList(selectedYear, selectedNumOf) as [value, label]}
						<option {value}>{label}</option>
					{/each}
				</select>
			{/if}

			{#if config.columnLabels.year}
				<select id="select-year" bind:value={selectedYear} class="select">
					<option value="" disabled selected>{config.columnLabels.year}</option>
					{#each getYearList(selectedGrade, selectedNumOf) as [value, label]}
						<option {value}>{label}</option>
					{/each}
				</select>
			{/if}

			{#if config.columnLabels.numOf}
				<select id="select-numof" bind:value={selectedNumOf} class="select">
					<option value="" disabled selected>{config.columnLabels.numOf}</option>
					{#each getNumOfList(selectedGrade, selectedYear) as [value, label]}
						<option {value}>{label}</option>
					{/each}
				</select>
			{/if}

			{#if config.columnLabels.publisher}
				<select id="select-publisher" bind:value={selectedPublisher} class="select">
					<option value="" disabled selected>{config.columnLabels.publisher}</option>
					{#each getPublisherList(selectedYear) as [value, label]}
						<option {value}>{label}</option>
					{/each}
				</select>
			{/if}

			<button class="variant-filled btn" on:click={onClearClick}>Clear</button>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#each resources as res}
				<div class="card border-surface-200-700-token w-full border p-4">
					{#if !res.url}
						<h2 class="flex-1">{res.title}</h2>
						<HelperText>Failed to get file.</HelperText>
					{:else if res.category < 10}
						<div class="flex items-center">
							<h2 class="flex-1">{res.title}</h2>
							<button
								on:click={() => onPlayPauseClick(res)}
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
						</div>
					{:else}
						<a class="anchor flex items-center" href={res.url} target="_blank">
							<h2>{res.title}</h2>
							<Icon icon="mdi:open-in-new" />
						</a>
					{/if}
				</div>
			{/each}
		</div>
	</Scrollable>
</div>
