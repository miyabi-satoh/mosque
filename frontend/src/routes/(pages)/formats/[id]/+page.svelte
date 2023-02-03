<script lang="ts">
	import { Alert, Button, P } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';

	export let data: PageData;
	$: resources = data.resources;

	function reload() {
		invalidate('app:formats');
	}
</script>

{#each resources as resource}
	<P class="w-full">{resource.slug}</P>
	<Button class="mb-4" on:click={reload}>再読み込み</Button>
	<div class="w-full">
		{#if resource.type == 'text'}
			<pre
				class="text-sm w-full border p-4 whitespace-pre-wrap max-h-80 overflow-y-scroll">{resource.text}</pre>
		{:else if resource.type == 'img'}
			<img class="w-full border" alt="preview" src={resource.blobUrl} />
		{:else if resource.type == 'pdf'}
			<object
				title="pdf"
				type="application/pdf"
				data={resource.blobUrl}
				class="h-[400px] md:h-[800px]"
			>
				<Alert color="yellow" class="w-full">プレビューを表示できません。</Alert>
			</object>
		{:else if resource.type == 'error'}
			<Alert color="red" class="w-full">
				エラー：{resource.status}<br />
				{#each resource.text.split('\n') as line}
					{line}<br />
				{/each}
			</Alert>
		{:else}
			<Alert color="yellow" class="w-full">
				この形式のファイルはプレビューを表示できません。<br />
				形式：{resource.mimeType}
			</Alert>
		{/if}
	</div>
{/each}

<style>
	object {
		border: none;
		width: 100%;
		/* height: 80vh; */
	}
</style>
