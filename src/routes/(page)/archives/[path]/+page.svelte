<script lang="ts">
	import { AudioPlayer, HelperText } from '$lib';
	import { scrollable } from '$lib/actions/scrollable';
	import { URLS } from '$lib/consts';
	import { submittingStore } from '$lib/stores';
	import Icon from '@iconify/svelte';
	import { tick } from 'svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;
	type Item = PageData['items'][0] & { url?: string };
	const hasGrade = data.items.find((item) => Boolean(item.strGrade)) !== undefined;
	const hasYear = data.items.find((item) => Boolean(item.strYear)) !== undefined;
	const hasSection = data.items.find((item) => Boolean(item.strSection)) !== undefined;
	let audioSrc: string = '';
	let audioTitle: string = '';
	let audioPaused: boolean = true;

	let selectedGrade = '';
	let selectedYear = '';
	let selectedSection = '';

	function filterByGrade(src: Item[], grade: string) {
		// console.log(`filterByGrade`, grade);
		if (!grade) {
			return src;
		}
		return src.filter((obj) => obj.strGrade === grade);
	}
	function filterByYear(src: Item[], year: string) {
		// console.log(`filterByYear`, year);
		if (!year) {
			return src;
		}
		return src.filter((obj) => obj.strYear === year);
	}
	function filterBySection(src: Item[], section: string) {
		// console.log(`filterBySection`, section);
		if (!section) {
			return src;
		}
		return src.filter((obj) => obj.strSection === section);
	}

	$: grades = getGradeList(selectedYear, selectedSection);
	function getGradeList(year: string, section: string) {
		// console.log(`getGradeList`, year, section);
		const filtered = filterByYear(filterBySection(data.items, section), year);
		const gradeSet = new Set<string | null>();
		filtered.forEach((obj) => {
			gradeSet.add(obj.strGrade);
		});
		return Array.from(gradeSet);
	}

	$: years = getYearList(selectedGrade, selectedSection);
	function getYearList(grade: string, section: string) {
		// console.log(`getYearList`, grade, section);
		const filtered = filterByGrade(filterBySection(data.items, section), grade);
		const yearSet = new Set<string | null>();
		filtered.forEach((obj) => {
			yearSet.add(obj.strYear);
		});
		return Array.from(yearSet);
	}

	$: sections = getSectionList(selectedGrade, selectedYear);
	function getSectionList(grade: string, year: string) {
		// console.log(`getSectionList`, grade, year);
		const filtered = filterByGrade(filterByYear(data.items, year), grade);
		const sectionSet = new Set<string | null>();
		filtered.forEach((obj) => {
			sectionSet.add(obj.strSection);
		});
		return Array.from(sectionSet);
	}

	async function onPlayPauseClick(res: Item) {
		if (res.url) {
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
	}

	$: promise = updateItems(selectedGrade, selectedYear, selectedSection);
	async function updateItems(grade: string, year: string, section: string) {
		// console.log(grade, year, section);
		if ((hasGrade && !grade) || (hasYear && !year) || (hasSection && !section)) {
			return [];
		}

		$submittingStore = true;
		// await tick();

		const newItems = data.items
			.filter(
				(item) =>
					(!grade || item.strGrade === grade) &&
					(!year || item.strYear === year) &&
					(!section || item.strSection === section)
			)
			.map((item) => {
				return {
					...item,
					url: `${$page.url.origin}${URLS.API_ARCHIVE_ITEM(item.id)}`
				};
			});

		for (const obj of newItems) {
			try {
				const res = await fetch(obj.url);
				if (res.ok) {
					continue;
				} else {
					console.error(res.statusText);
				}
			} catch (err) {
				console.error(err);
			}
			obj.url = '';
		}
		$submittingStore = false;
		return newItems;
	}

	function onClearClick() {
		selectedGrade = selectedYear = selectedSection = '';
		audioPaused = true;
		audioSrc = audioTitle = '';
	}
</script>

<div class="px-4 pb-8">
	<AudioPlayer src={audioSrc} title={audioTitle} bind:paused={audioPaused} />
</div>

<div class="flex-1 space-y-4 pl-4 pr-2" use:scrollable>
	<div class="flex flex-col gap-4 sm:flex-row sm:justify-between">
		{#if hasGrade}
			<select id="select-grade" bind:value={selectedGrade} class="select">
				<option value="" disabled selected>-- Grade --</option>
				{#each grades as grade}
					<option value={grade}>{grade}</option>
				{/each}
			</select>
		{/if}

		{#if hasYear}
			<select id="select-year" bind:value={selectedYear} class="select">
				<option value="" disabled selected>-- Year --</option>
				{#each years as year}
					<option value={year}>{year}</option>
				{/each}
			</select>
		{/if}

		{#if hasSection}
			<select id="select-section" bind:value={selectedSection} class="select">
				<option value="" disabled selected>-- Section --</option>
				{#each sections as section}
					<option value={section}>{section}</option>
				{/each}
			</select>
		{/if}

		<button class="variant-ghost btn" on:click={onClearClick}>Clear</button>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		{#await promise then items}
			{#each items as item}
				<div class="card border-surface-200-700-token w-full border p-4">
					{#if !item.url}
						<h2 class="flex-1">{item.title}</h2>
						<HelperText>Failed to get file.</HelperText>
					{:else if item.path.match(/\.mp3$/)}
						<div class="flex items-center">
							<h2 class="flex-1">
								<!-- {item.strYear}
								{item.strGrade}
								{item.strSection} -->
								{item.title}
							</h2>
							<button
								on:click={() => onPlayPauseClick(item)}
								disabled={!item.url}
								class:variant-ghost-tertiary={audioSrc.endsWith(item.url)}
								class:variant-filled-primary={!audioSrc.endsWith(item.url)}
								class="btn"
							>
								<Icon
									icon={audioSrc.endsWith(item.url) && !audioPaused ? 'mdi:pause' : 'mdi:play'}
									height="auto"
								/>
							</button>
						</div>
					{:else}
						<a class="anchor flex h-full flex-1 items-center" href={item.url} target="_blank">
							<h2>{item.title}</h2>
							<Icon icon="mdi:open-in-new" />
						</a>
					{/if}
				</div>
			{/each}
		{/await}
	</div>
</div>
