<script lang="ts">
	import { error } from '@sveltejs/kit';
	import { format } from 'date-fns';
	import { onDestroy } from 'svelte';
	import type { Asset } from '@prisma/client';
	import type { ActionData } from './$types';
	import { userStore } from '$lib/user';
	import IconButton from '$lib/components/form/IconButton.svelte';
	import { addToast } from '$lib/components/Toast.svelte';
	import Dropzone from '$lib/components/Dropzone.svelte';
	import { applyAction, enhance } from '$app/forms';
	import Modal, { toggleModal } from '$lib/components/Modal.svelte';

	const ID_IMPORT_USER = 'import-user-modal';
	const ID_UPDATE_CACHE = 'update-cache-modal';

	// export let data: PageData;
	export let form: ActionData | undefined;
	let loading: boolean;
	let selectedFiles: FileList | undefined;
	let textData: string | undefined;
	let useEnhance = false;

	$: if (!$userStore || $userStore.id != 1) {
		error(404, 'Not Found');
	}

	const errorDetail = (key: string) => {
		if (form && form.errors) {
			return `${key}:${form.errors[key as keyof typeof form.errors]}`;
		}
		return '';
	};
	const showImportUserResult = () => {
		console.log(`showImportUserResult`);
		if (useEnhance) {
			console.log(form);
			if (form && form.success) {
				toggleModal(ID_IMPORT_USER);
				addToast(form.message, 'alert-success');
				selectedFiles = undefined;
				textData = undefined;
			}
			// その他のエラーはモーダルに表示される
		} else {
			// モーダルは閉じられているので、トースト表示
			if (form && form.message) {
				if (form.success) {
					addToast(form.message, 'alert-success');
				} else {
					addToast(form.message, 'alert-error');
				}
				if (form.errors) {
					Object.keys(form.errors).map((key) => addToast(errorDetail(key), 'alert-error'));
				}
			}
			form = undefined;
		}
	};
	if (form) {
		showImportUserResult();
	}

	const resetImportUserForm = () => {
		console.log(`resetImportUserForm`);
		selectedFiles = undefined;
		textData = undefined;
		form = undefined;
	};

	const handleImportUser = () => {
		console.log(`handleImportUser`);
		resetImportUserForm();
	};

	const handleExportUser = async () => {
		console.log(`handleExportUser`);
		loading = true;
		const filter = {
			where: {
				id: {
					not: 1
				}
			},
			orderBy: {
				id: 'asc'
			},
			select: {
				id: true,
				username: true,
				password: true,
				sei: true,
				mei: true,
				seiKana: true,
				meiKana: true,
				abbrev: true,
				displayName: true,
				blocked: true
			}
		};
		const query = new URLSearchParams({ filter: encodeURIComponent(JSON.stringify(filter)) });
		const res = await fetch(`/api/user?${query}`);
		if (res.ok) {
			const json = await res.json();
			const data = JSON.stringify(json, null, '\t');

			const blob = new Blob([data], { type: 'application/json' });

			const a = window.document.createElement('a');
			a.download = `export_mosque_user_${format(new Date(), 'yyyyMMddHHmmss')}.json`;
			a.href = URL.createObjectURL(blob);
			a.click();
			URL.revokeObjectURL(a.href);
		} else {
			addToast(`${res.status}:${res.statusText}`, 'alert-error');
		}
		loading = false;
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
		toggleModal(ID_UPDATE_CACHE);
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
				cancel = true;
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

	const handleRemoveCache = () => {
		console.log(`handleRemoveCache`);
		alert('未実装');
	};

	$: if (selectedFiles) {
		setPreview(selectedFiles);
	}
	const setPreview = async (files: FileList) => {
		const file = files[0];
		if (file) {
			textData = await file.text();
		}
	};
</script>

<h2>メニュー</h2>
<div class="my-6 bg-base-300 p-4">
	<h3 class="mt-0">ユーザー管理</h3>
	<div class="flex gap-4">
		<IconButton icon="mdi:upload" for={ID_IMPORT_USER} on:click={handleImportUser}
			>インポート</IconButton
		>
		<IconButton icon="mdi:download" on:click={handleExportUser}>エクスポート</IconButton>
	</div>
</div>

<div class="my-6 bg-base-300 p-4">
	<h3 class="mt-0">リソース管理</h3>
	<div class="flex gap-4">
		<IconButton icon="mdi:file-refresh" for={ID_UPDATE_CACHE} on:click={handleUpdateCache}
			>キャッシュ更新</IconButton
		>
		<IconButton icon="mdi:filter-remove" on:click={handleRemoveCache}>不要キャッシュ削除</IconButton
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
	{#if loading}
		<p>wait...</p>
	{:else if assets}
		<p>対象のデータ：{assets.length} 件</p>
		{#if assets.length > 0}
			<button class="btn btn-primary" on:click={handleStartUpdateCache}>開始</button>
		{/if}
	{/if}
</Modal>

<Modal id={ID_IMPORT_USER} class="w-2/3 {textData ? 'max-w-2xl' : ''}">
	<h4 class="my-0">インポート</h4>
	{#if selectedFiles && selectedFiles.length > 0}
		<p class="my-0">{selectedFiles[0].name}</p>
		{#if textData !== undefined}
			<pre class="my-0 h-[40vh] overflow-scroll">{textData}</pre>
		{/if}
		{#if form && !form.success && form.message}
			<div class="my-4 p-2 bg-error text-error-content">
				{form.message}
				{#if form.errors}
					<ul class="my-2">
						{#each Object.keys(form.errors) as key}
							<li>{errorDetail(key)}</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
		<div class="flex items-center justify-between w-full mt-4">
			<button class="btn btn-default" on:click|preventDefault={resetImportUserForm}>再選択</button>
			<form
				method="POST"
				use:enhance={() => {
					useEnhance = true;
					// `form` は `<form>` 要素です
					// `data` はその `FormData` オブジェクトです
					// `action` はフォームが POST される URL です
					// `cancel()` は送信(submission)を中止します

					return async ({ result }) => {
						console.log(result);
						// `result` は `ActionResult` オブジェクトです
						// if (result.type === 'error') {
						await applyAction(result);
						showImportUserResult();
						// }
					};
				}}
			>
				<input type="hidden" name="json" value={textData} />
				<button class="btn btn-primary">インポート</button>
			</form>
		</div>
	{:else}
		<div class="not-prose flex items-center justify-center w-full mt-4">
			<Dropzone id="selected-file" name="file" accept=".json" bind:files={selectedFiles} />
		</div>
	{/if}
</Modal>
