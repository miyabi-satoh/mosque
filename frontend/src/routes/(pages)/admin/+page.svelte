<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { ActionData, PageData } from './$types';
	import { userStore } from '$lib/user';
	import IconButton from '$lib/components/form/IconButton.svelte';
	import { format } from 'date-fns';
	import { addToast } from '$lib/components/Toast.svelte';
	import Dropzone from '$lib/components/Dropzone.svelte';
	import Portal from 'svelte-portal';
	import { applyAction, enhance } from '$app/forms';

	const ID_IMPORT_USER = 'import-user-modal';
	// export let data: PageData;
	export let form: ActionData | undefined;
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
				window.document.getElementById(ID_IMPORT_USER)?.click();
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
				}
				if (form.error) {
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

	const handleImportUser = () => {
		console.log(`handleImportUser`);
		form = undefined;
	};

	const handleExportUser = async () => {
		// console.log(`handleExportUser`);
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
	};

	const handleUpdateCache = () => {
		console.log(`handleUpdateCache`);
		alert('未実装');
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
		<IconButton icon="mdi:file-refresh" on:click={handleUpdateCache}>キャッシュ更新</IconButton>
		<IconButton icon="mdi:filter-remove" on:click={handleRemoveCache}>不要キャッシュ削除</IconButton
		>
	</div>
</div>

<!-- コンポーネント化できそう -->
<Portal target="#modals">
	<input type="checkbox" id={ID_IMPORT_USER} class="modal-toggle" />
	<label for={ID_IMPORT_USER} class="modal cursor-pointer">
		<label for="" class="modal-box w-2/3" class:max-w-2xl={textData}>
			<label for={ID_IMPORT_USER} class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
			<h4 class="my-0">インポート</h4>
			{#if selectedFiles && selectedFiles.length > 0}
				<p class="my-0">{selectedFiles[0].name}</p>
				{#if textData !== undefined}
					<pre class="my-0 h-[40vh] overflow-scroll">{textData}</pre>
				{/if}
				{#if form && form.error && form.message}
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
					<button
						class="btn btn-default"
						on:click|preventDefault={() => {
							selectedFiles = undefined;
							textData = undefined;
						}}>再選択</button
					>
					<form
						method="POST"
						action="?/upload-user"
						use:enhance={({ form, data, action, cancel }) => {
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
						<input type="hidden" name="body" value={textData} />
						<button class="btn btn-primary">インポート</button>
					</form>
				</div>
			{:else}
				<div class="not-prose flex items-center justify-center w-full mt-4">
					<Dropzone id="selected-file" name="file" accept=".json" bind:files={selectedFiles} />
				</div>
			{/if}
		</label>
	</label>
</Portal>
