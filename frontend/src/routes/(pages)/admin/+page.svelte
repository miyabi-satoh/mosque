<script lang="ts">
	import { format } from 'date-fns';
	import { onDestroy } from 'svelte';
	import type { Asset } from '@prisma/client';
	import type { ActionData } from './$types';
	import IconButton from '$lib/components/form/IconButton.svelte';
	import { addToast } from '$lib/components/Toast.svelte';
	import Dropzone from '$lib/components/Dropzone.svelte';
	import { applyAction, enhance } from '$app/forms';
	import Modal, { closeModal } from '$lib/components/Modal.svelte';
	import IconLinkButton from '$lib/components/form/IconLinkButton.svelte';
	import { page } from '$app/stores';
	import { MIME_JSON, URL_ADMIN_USERS } from '$lib/constants';

	const ID_UPDATE_CACHE = 'update-cache-modal';
	const URL_RESOURCE_CREATE = `${$page.url.pathname}/resources/create`;
	const URL_RESOURCE_READ = `${$page.url.pathname}/resources`;

	let loading = false;

	const handleEscKey = (event: KeyboardEvent) => {
		if (event.key == 'Escape') {
			closeModal(ID_UPDATE_CACHE);
		}
	};

	let assets: Asset[];
	const handleUpdateCache = async () => {
		console.log(`handleUpdateCache`);
		loading = true;
		assets = [];
		const res = await fetch(`/api/asset`);
		if (res.ok) {
			assets = await res.json();
		}
		loading = false;
	};

	let cancel = false;
	let progress = 0;
	let message = '';
	const handleStartUpdateCache = async () => {
		console.log('handleStartUpdateCache');
		closeModal(ID_UPDATE_CACHE);
		cancel = false;
		progress = 1;
		for (const asset of assets) {
			if (cancel) {
				break;
			}
			message = `(${progress}/${assets.length}) ${asset.title ?? ''}`;
			const res = await fetch(`/api/asset/${asset.id}/${asset.slug}`);
			if (!res.ok) {
				addToast(`${res.status}:${res.statusText}`, 'alert-error');
				// cancel = true;
			} else {
				progress++;
			}
		}
		if (cancel) {
			addToast(`中断しました。`, 'alert-warning');
		} else {
			addToast(`完了しました。`, 'alert-success');
		}
		assets = [];
		progress = 0;
		cancel = false;
	};
	onDestroy(() => {
		cancel = true;
	});

	const handleCancel = () => {
		console.log(`handleCancel`);
		cancel = true;
	};
</script>

<h2>メニュー</h2>
<div class="my-6 bg-base-300 p-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
	<h3 class="my-0"><a href={URL_ADMIN_USERS} class="link">ユーザー管理</a></h3>
</div>

<div class="my-6 bg-base-300 p-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
	<h3 class="my-0"><a href={URL_RESOURCE_READ} class="link">リソース管理</a></h3>
	<div class="flex gap-4 items-center">
		<IconLinkButton icon="mdi:file-plus" href={URL_RESOURCE_CREATE} class="btn-accent"
			>追加</IconLinkButton
		>
		<IconButton icon="mdi:file-refresh" for={ID_UPDATE_CACHE} on:click={handleUpdateCache}
			>キャッシュ更新</IconButton
		>
	</div>
	{#if progress > 0}
		<div class="mt-4 flex items-center gap-2">
			<button class="btn btn-sm btn-circle" disabled={cancel} on:click={handleCancel}>✕</button>
			<div class="flex-1">{message}</div>
		</div>
	{/if}
</div>

<Modal id={ID_UPDATE_CACHE}>
	<h4 class="my-0">キャッシュ更新</h4>
	<form on:keyup={handleEscKey}>
		{#if loading}
			<p>wait...</p>
		{:else if assets}
			<p>対象のデータ：{assets.length} 件</p>
			{#if assets.length > 0}
				<button class="btn btn-primary" on:click|preventDefault={handleStartUpdateCache}
					>開始</button
				>
			{/if}
		{/if}
	</form>
</Modal>
