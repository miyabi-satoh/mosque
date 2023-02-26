<script lang="ts">
	import type { PageData } from './$types';
	import { addToast } from '$lib/components/Toast.svelte';

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

	const handleClickPrint = async () => {
		const assetId = activeResource.id;
		window.document.getElementById('print-confirm')?.click();
		const res = await fetch(`/api/asset/print/${assetId}`);
		if (res.ok) {
			const json = await res.json();
			if (json.success) {
				addToast('プリンタに送信しました', 'alert-success');
			} else {
				addToast('印刷に失敗しました', 'alert-error');
			}
			console.log(json);
		} else {
			addToast(res.statusText, 'alert-error');
			// res.statusText
			// todo
			console.log(res);
		}
	};
</script>

{#if data.assets.length == 0}
	<p>アイテムはありません</p>
{:else}
	<div class="tabs justify-center">
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
			{#if objContainerClass.length}
				<div class="flex gap-4 justify-end">
					<a
						class="btn btn-primary btn-sm my-4"
						href={activeResource.blobUrl}
						target="_blank"
						rel="noreferrer">新しいタブで開く</a
					>
					<!-- <label class="btn btn-primary btn-sm my-4" for="print-confirm">印刷</label> -->
				</div>
			{/if}
			<div class={objContainerClass}>
				<object
					class="border-0"
					title="pdf"
					type={activeResource.mimeType}
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
		{:else if activeResource.type == 'audio'}
			<audio controls preload="metadata" src={activeResource.blobUrl} class="w-full">
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
		{:else}
			<div class="alert alert-warning shadow-lg">
				<div>
					この形式のファイルはプレビューを表示できません。<br />
					形式：{activeResource.mimeType}
				</div>
			</div>
		{/if}
	</div>
{/if}

<input type="checkbox" id="print-confirm" class="modal-toggle" />
<div class="modal">
	<div class="modal-box">
		<h3 class="my-0 text-center">注意</h3>
		<ul class="my-4">
			<li>
				<span class="font-bold underline text-red-500">全ページを</span>印刷します。
			</li>
			<li>
				A4サイズを印刷する場合、他のスタッフが<span class="font-bold underline text-red-500"
					>宛名シール印刷を行っていないことを確認</span
				>してから開始してください。
			</li>
		</ul>
		<p class="my-4">印刷を開始してもよろしいですか？</p>
		<div class="modal-action flex justify-between">
			<label for="print-confirm" class="btn">キャンセル</label>
			<button class="btn btn-primary" on:click={handleClickPrint}>印刷開始</button>
		</div>
	</div>
</div>
