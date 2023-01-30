<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { Alert, Button } from 'flowbite-svelte';
	import type { BlobType } from '$models/interfaces';
	import { apiUrl } from '$lib/utils';

	$: data = $page.data;
	let text = '';
	let blobUrl = '';
	let promise: Promise<BlobType>;

	function reload() {
		invalidate('app:formats');
	}

	$: if (data) promise = getBlobType();
	async function getBlobType(): Promise<BlobType> {
		text = '';
		blobUrl = '';
		switch (data.type) {
			case 'text':
				text = await data.blob.text();
				break;
			case 'img':
				blobUrl = apiUrl(`formats/${$page.params.id}`);
				break;
			case 'pdf':
				blobUrl = apiUrl(`formats/${$page.params.id}/${data.pageInfo?.title}`);
				break;
			case 'error':
				text = '';
				if (data.blob) {
					const json = JSON.parse(await data.blob.text());
					text += json.detail;
				}
				switch (data.status) {
					case 404:
						text += `ファイルが存在しません`;
						break;
					case 500:
						text += `ファイルの取得に失敗しました`;
				}
		}
		return data.type;
	}
</script>

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
				エラー：{data.status}<br />
				{#each text.split('\n') as line}
					{line}<br />
				{/each}
			</Alert>
		{:else}
			<Alert color="yellow" class="w-full">
				この形式のファイルはプレビューを表示できません。<br />
				形式：{data.blob?.type}
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
