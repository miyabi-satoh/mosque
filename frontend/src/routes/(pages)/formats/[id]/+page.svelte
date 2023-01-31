<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { Alert, Button, P } from 'flowbite-svelte';
	import type { BlobType } from '$models/interfaces';
	import { apiUrl } from '$lib/utils';
	import type { PageData } from './$types';

	// $: data = $page.data;
	export let data: PageData;
	let text = '';
	let blobUrl = '';
	let promise: Promise<BlobType>;

	function reload() {
		invalidate('app:formats');
	}

	$: if (data) promise = getBlobType();
	async function getBlobType(): Promise<BlobType> {
		const content = data.content;
		text = '';
		blobUrl = '';
		switch (content.type) {
			case 'text':
				text = await content.blob.text();
				break;
			case 'img':
				blobUrl = apiUrl(`formats/${$page.params.id}/${content.format.title}`);
				break;
			case 'pdf':
				blobUrl = apiUrl(`formats/${$page.params.id}/${content.format.title}`);
				break;
			case 'error':
				{
					let lines: string[] = [];
					switch (content.status) {
						case 404:
							lines.push(`ファイルが存在しません`);
							break;
						case 500:
							lines.push(`ファイルの取得に失敗しました`);
					}
					if (content.blob) {
						const blobText = await content.blob.text();
						const json = JSON.parse(blobText);
						lines.push(json.detail);
					}
					text = lines.join('\n');
				}
				break;
		}
		return content.type;
	}
</script>

<P class="w-full">{data.content.format.realPath}</P>
<Button class="mb-4" on:click={reload}>再読み込み</Button>
<div class="w-full">
	{#await promise then blobType}
		{#if blobType == 'text'}
			<pre
				class="text-sm w-full border p-4 whitespace-pre-wrap max-h-80 overflow-y-scroll">{text}</pre>
		{:else if blobType == 'img'}
			<img class="w-full border" alt="preview" src={blobUrl} />
		{:else if blobType == 'pdf'}
			<object title="pdf" type="application/pdf" data={blobUrl} class="h-[400px] md:h-[800px]">
				<Alert color="yellow" class="w-full">プレビューを表示できません。</Alert>
			</object>
		{:else if blobType == 'error'}
			<Alert color="red" class="w-full">
				エラー：{data.content.status}<br />
				{#each text.split('\n') as line}
					{line}<br />
				{/each}
			</Alert>
		{:else}
			<Alert color="yellow" class="w-full">
				この形式のファイルはプレビューを表示できません。<br />
				形式：{data.content.blob.type}
			</Alert>
		{/if}
	{/await}
</div>

<style>
	object {
		border: none;
		width: 100%;
		/* height: 80vh; */
	}
</style>
