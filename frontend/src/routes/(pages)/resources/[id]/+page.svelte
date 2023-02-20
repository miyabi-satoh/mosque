<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	let objContainerClass = '';
	let activeTabIndex = 0;
	let activeResource: (typeof data.assets)[0];
	$: if (data.assets.length > 0) {
		activeResource = data.assets[0];
	}

	function handleClickTab(index: number) {
		objContainerClass = '';
		activeTabIndex = index;
		activeResource = data.assets[index];
	}

	function onLoadObject() {
		// console.log('onLoadObject');
		objContainerClass = 'aspect-w-5 aspect-h-7';
	}
</script>

{#if data.assets.length == 0}
	<p>アイテムはありません</p>
{:else}
	<div class="tabs">
		{#each data.assets as asset, index}
			<button
				on:click={() => handleClickTab(index)}
				class="tab tab-bordered {activeTabIndex == index ? 'tab-active' : ''}">{asset.slug}</button
			>
		{/each}
	</div>
	<div class="border-2 border-base-200 p-2">
		{#if activeResource.type == 'error'}
			<div class="alert alert-error shadow-lg">
				<div>
					エラー：{activeResource.status}<br />
					{#each activeResource.text.split('\n') as line}
						{line}<br />
					{/each}
				</div>
			</div>
		{:else if activeResource.type == 'unknown'}
			<div class="alert alert-warning shadow-lg">
				<div>
					この形式のファイルはプレビューを表示できません。<br />
					形式：{activeResource.mimeType}
				</div>
			</div>
		{:else if activeResource.type == 'text'}
			<pre
				class="text-sm w-full whitespace-pre-wrap max-h-80 overflow-y-scroll">{activeResource.text}</pre>
		{:else if activeResource.type == 'img'}
			<img class="w-full" alt="preview" src={activeResource.blobUrl} />
			<a
				class="btn btn-primary btn-sm my-4"
				href={activeResource.blobUrl}
				target="_blank"
				rel="noreferrer">新しいタブで開く</a
			>
		{:else if activeResource.type == 'pdf'}
			<div class={objContainerClass}>
				<object
					class="border-0"
					title="pdf"
					type="application/pdf"
					data={activeResource.blobUrl}
					on:load={onLoadObject}
				>
					<div class="alert alert-error shadow-lg my-8">
						<div>プレビューを表示できません。</div>
					</div>
					{#if activeResource.uri && activeResource.uri.startsWith('http')}
						<div class="text-center my-8">
							<a href={activeResource.uri} class="link" target="_blank" rel="noreferrer"
								>こちらを試してみてください</a
							>
						</div>
					{/if}
				</object>
			</div>
			{#if objContainerClass.length}
				<a
					class="btn btn-primary btn-sm my-4"
					href={activeResource.blobUrl}
					target="_blank"
					rel="noreferrer">新しいタブで開く</a
				>
			{/if}
		{:else if activeResource.type == 'audio'}
			<audio controls src={activeResource.blobUrl}>
				<div class="alert alert-error shadow-lg">
					<div>オーディオコントロールを表示できません。</div>
					{#if activeResource.uri && activeResource.uri.startsWith('http')}
						<div class="text-center my-8">
							<a href={activeResource.uri} class="link" target="_blank" rel="noreferrer"
								>こちらを試してみてください</a
							>
						</div>
					{/if}
				</div>
			</audio>
		{:else if activeResource.type == 'video'}
			<!-- svelte-ignore a11y-media-has-caption -->
			<video controls src={activeResource.blobUrl}>
				<div class="alert alert-error shadow-lg">
					<div>オーディオコントロールを表示できません。</div>
					{#if activeResource.uri && activeResource.uri.startsWith('http')}
						<div class="text-center my-8">
							<a href={activeResource.uri} class="link" target="_blank" rel="noreferrer"
								>こちらを試してみてください</a
							>
						</div>
					{/if}
				</div>
			</video>
		{/if}
	</div>
{/if}
