<script lang="ts">
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { Alert, Button } from 'flowbite-svelte';

	type BlobType = 'text' | 'image' | 'unknown' | 'error';

	$: data = $page.data;
	let text: string;
	let promise: Promise<BlobType>;

	function reload() {
		console.log('reload');
		invalidate('app:formats');
	}

	$: if (data) promise = getBlobType();
	async function getBlobType(): Promise<BlobType> {
		if (data.status !== 200) {
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
			return 'error';
		}
		if (data.blob) {
			const type = data.blob.type;
			if (type.includes('text/') || type.includes('application/json')) {
				text = await data.blob.text();
				return 'text';
			}
			if (type.includes('image/')) {
				return 'image';
			}
			return 'unknown';
		}
		return 'error';
	}
</script>

<Button class="mb-4" on:click={reload}>再読み込み</Button>
{#await promise then blobType}
	{#if blobType == 'text'}
		<pre
			class="text-sm w-full border p-4 whitespace-pre-wrap max-h-80 overflow-y-scroll">{text}</pre>
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
