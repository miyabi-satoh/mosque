<script lang="ts">
	import Icon from '@iconify/svelte';
	import { format } from 'date-fns';
	import type { ActionData, PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import { browser } from '$app/environment';
	import IconLinkButton from '$lib/components/form/IconLinkButton.svelte';
	import Modal, { closeModal } from '$lib/components/Modal.svelte';
	import Dropzone from '$lib/components/Dropzone.svelte';
	import { addToast } from '$lib/components/Toast.svelte';
	import { applyAction, enhance } from '$app/forms';
	import { MIME_JSON } from '$lib/constants';

	const URL_USER_CREATE = `${$page.url.pathname}/create`;
	const URL_USER_EDIT = (id: number) => `${$page.url.pathname}/${id}/edit`;
	const URL_USER_DELETE = (id: number) => `${$page.url.pathname}/${id}/delete`;
	const ID_IMPORT_USER = 'import-user-modal';

	export let data: PageData;
	export let form: ActionData | undefined;
	let selectedFiles: FileList | undefined;
	let textData: string | undefined;
	let useEnhance = false;

	const handleEscKey = (event: KeyboardEvent) => {
		if (event.key == 'Escape') {
			closeModal(ID_IMPORT_USER);
		}
	};

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
				closeModal(ID_IMPORT_USER);
				addToast(form.message ?? '', 'alert-success');
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

	function movePage(event: CustomEvent<number>) {
		refresh(false, event.detail);
	}

	function refresh(force: boolean, p = 1) {
		const search = `?p=${p}&q=${encodeURIComponent(data.querySearch)}`;
		if (force || search != $page.url.search) {
			goto(`${$page.url.pathname}${search}`, {
				keepFocus: true
			});
		}
	}

	$: if (browser) {
		data.querySearch;
		refresh(false);
	}

	$: if (selectedFiles) {
		setPreview(selectedFiles);
	}
	const setPreview = async (files: FileList) => {
		const file = files[0];
		if (file) {
			textData = await file.text();
		}
	};

	const handleExport = async () => {
		console.log(`handleExport`);
		// loading = true;
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

			const blob = new Blob([data], { type: MIME_JSON });

			const a = window.document.createElement('a');
			a.download = `export_mosque_user_${format(new Date(), 'yyyyMMddHHmmss')}.json`;
			a.href = URL.createObjectURL(blob);
			a.click();
			URL.revokeObjectURL(a.href);
		} else {
			addToast(`${res.status}:${res.statusText}`, 'alert-error');
		}
		// loading = false;
	};
</script>

<div class="flex items-center justify-between">
	<IconLinkButton icon="mdi:account-plus" href={URL_USER_CREATE} class="btn-accent"
		>追加</IconLinkButton
	>

	<div class="flex gap-4">
		<label for="upload" class="btn btn-primary gap-2">
			<Icon icon="mdi:upload" height="20" />
			<span>インポート</span>
		</label>
		<button class="btn btn-primary gap-2" on:click={handleExport}>
			<Icon icon="mdi:download" height="20" />
			<span>エクスポート</span>
		</button>
	</div>
</div>

<div class="pt-4">
	<input
		bind:value={data.querySearch}
		type="text"
		placeholder="Search keywords..."
		class="input input-bordered w-full"
	/>
</div>

{#if data.count > 0}
	<div class="overflow-x-auto">
		<table class="table table-zebra w-full mt-2">
			<!-- head -->
			<thead>
				<tr>
					<th>ユーザー名</th>
					<th>氏名</th>
					<th>氏名カナ</th>
					<th>略称</th>
					<th>表示名</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
				<!-- row -->
				{#each data.users as user (user.id)}
					<tr>
						<td>{user.username}</td>
						<td>{user.sei} {user.mei}</td>
						<td>{user.seiKana} {user.meiKana}</td>
						<td>{user.abbrev}</td>
						<td>{user.displayName}</td>
						<td>
							<div class="flex items-center gap-4">
								<a href={URL_USER_EDIT(user.id)} title="編集"
									><Icon icon="mdi:edit" height="18" /></a
								>
								{#if user.id > 1}
									<a href={URL_USER_DELETE(user.id)} title="削除"
										><Icon icon="mdi:trash" height="18" /></a
									>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div class="flex justify-center my-4">
		<Pagination
			on:page={movePage}
			count={data.count}
			currentPage={data.queryPage}
			pageSize={data.pageSize}
		/>
	</div>
{:else}
	<p>データがありません</p>
{/if}

<Modal id={ID_IMPORT_USER} class="w-2/3 {textData ? 'max-w-2xl' : ''}">
	<h4 class="my-0">インポート</h4>
	<form
		on:keyup={handleEscKey}
		method="POST"
		use:enhance={() => {
			useEnhance = true;

			return async ({ result }) => {
				console.log(result);
				await applyAction(result);
				showImportUserResult();
			};
		}}
	>
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
				<button class="btn btn-default" on:click|preventDefault={resetImportUserForm}>再選択</button
				>
				<input type="hidden" name="json" value={textData} />
				<button class="btn btn-primary">インポート</button>
			</div>
		{:else}
			<div class="not-prose flex items-center justify-center w-full mt-4">
				<Dropzone id="selected-file" name="file" accept=".json" bind:files={selectedFiles} />
			</div>
		{/if}
	</form>
</Modal>
