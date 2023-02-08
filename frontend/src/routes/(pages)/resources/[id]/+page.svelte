<script lang="ts">
	import { Alert, P, TabItem, Tabs } from 'flowbite-svelte';
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';

	export let data: PageData;
	console.log(data.resources);

	function reload() {
		invalidate('app:resources');
	}
</script>

{#if data.resources.length == 0}
	<P class="w-full">アイテムはありません</P>
{:else}
	<Tabs style="underline" contentClass="p-4 bg-gray-50 rounded-lg dark:bg-gray-800 mt-4 w-full">
		{#each data.resources as resource, index}
			<TabItem open={index == 0} title={resource.data.attributes.slug}>
				<div class="w-full">
					{#if resource.type == 'error'}
						<Alert color="red" class="w-full">
							エラー：{resource.status}<br />
							{#each resource.text.split('\n') as line}
								{line}<br />
							{/each}
						</Alert>
					{:else if resource.type == 'unknown'}
						<Alert color="yellow" class="w-full">
							この形式のファイルはプレビューを表示できません。<br />
							形式：{resource.mimeType}
						</Alert>
					{:else if resource.type == 'text'}
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
					{:else if resource.type == 'audio'}
						<audio controls src={resource.blobUrl}>
							<Alert color="yellow" class="w-full">オーディオコントロールを表示できません。</Alert>
						</audio>
					{:else if resource.type == 'video'}
						<!-- svelte-ignore a11y-media-has-caption -->
						<video controls src={resource.blobUrl}>
							<Alert color="yellow" class="w-full">オーディオコントロールを表示できません。</Alert>
						</video>
					{/if}
				</div>
			</TabItem>
		{/each}
	</Tabs>
{/if}

<style>
	object {
		border: none;
		width: 100%;
		/* height: 80vh; */
	}
</style>
