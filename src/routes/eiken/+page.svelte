<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { PageData } from './$types';
	import { tick } from 'svelte';
	import { AudioPlayer } from '$lib';

	export let data: PageData;
	let audioSrc: string = '';
	let audioTitle: string = '';
	let audioPaused: boolean = true;

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
		const url = `/api/data/eiken?key=${encodeURIComponent(key)}`;
		const res = await fetch(url);
		if (res.ok) {
			return url;
		}
		return '';
	}

	async function handleClickPlayPause(title: string, src: string) {
		if (audioSrc === src) {
			audioPaused = !audioPaused;
		} else {
			audioPaused = true;
			await tick();
			audioSrc = src;
			audioTitle = title;
			audioPaused = false;
		}
	}
</script>

<main class="container mx-auto max-w-3xl flex-1">
	<h1 class="p-4 text-4xl font-semibold">英検過去問配信サービス</h1>
	<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
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

	<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
		{#each [...mediaUrls.entries()] as [key, url]}
			<div class="card w-full rounded-md border border-base-content/20">
				<div class="card-body justify-between p-4">
					<h2 class="card-title">{key}</h2>
					<div class="card-actions mt-4 justify-center">
						{#if key.toLowerCase().includes('part')}
							<button
								on:click={() => handleClickPlayPause(key, url)}
								disabled={!url}
								class:btn-outline={!audioSrc.endsWith(url)}
								class="btn btn-info btn-sm w-16 rounded-3xl"
							>
								<Icon
									height="auto"
									icon={audioSrc.endsWith(url) && !audioPaused ? 'mdi:pause' : 'mdi:play'}
								/>
							</button>
						{:else}
							<a href={url} target="_blank" class="btn btn-primary">新しいタブで開く</a>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>

	<AudioPlayer src={audioSrc} title={audioTitle} bind:paused={audioPaused} />
</main>
