<script lang="ts">
	import Icon from '@iconify/svelte';
	import { format } from 'date-fns';
	import type { ActionData, PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { API, MIME_JSON, URL_ADMIN_USERS, URL_ADMIN_USERS_CREATE } from '$lib/constants';
	import { fields } from '$lib/fields';
	import { onMount } from 'svelte';
	import { userPublicFields, userType, userTypeString } from '$lib/user';
	import Modal, { closeModal, showModal } from '$lib/components/organisms/Modal.svelte';
	import { addToast } from '$lib/components/organisms/Toast.svelte';
	import IconLinkButton from '$lib/components/molecules/IconLinkButton.svelte';
	import Pagination from '$lib/components/organisms/Pagination.svelte';
	import Dropzone from '$lib/components/organisms/Dropzone.svelte';
	import { Search } from '$lib/components';

	const URL_EDIT = (id: number) => `${URL_ADMIN_USERS}/${id}/edit`;
	const URL_DELETE = (id: number) => `${URL_ADMIN_USERS}/${id}/delete`;
	const ID_IMPORT_USER = 'import-user-modal';

	export let data: PageData;
	export let form: ActionData | undefined;
	let selectedFiles: FileList | undefined;
	let fileName: string | undefined;
	let jsonData: string | undefined;

	$: formReaction(form);
	$: searchReaction(data.querySearch);
	$: fileSelectReaction(selectedFiles);
	const formReaction = (_form: ActionData | undefined) => {
		if (form) {
			console.log(`form reaction`);
			if (form.success) {
				closeModal(ID_IMPORT_USER);
				addToast(form.message ?? '', 'alert-success');
				selectedFiles = undefined;
				jsonData = undefined;
				fileName = undefined;
			} else {
				fileName = form.formData?.file;
				jsonData = form.formData?.json;
			}
		}
	};
	const searchReaction = (_search: string) => {
		console.log(`search reaction`);
		refresh(false);
	};
	const fileSelectReaction = (_files: FileList | undefined) => {
		if (selectedFiles && selectedFiles.length > 0 && selectedFiles[0]) {
			console.log(`selectedFiles reaction`);
			const file = selectedFiles[0];
			file.text().then((value) => {
				fileName = file.name;
				jsonData = value;
			});
		}
	};

	onMount(() => {
		if (form && !form.success) {
			showModal(ID_IMPORT_USER);
		}
	});

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

	const resetImportUserForm = () => {
		console.log(`resetImportUserForm`);
		selectedFiles = undefined;
		jsonData = undefined;
		fileName = undefined;
		form = undefined;
	};

	function movePage(event: CustomEvent<number>) {
		refresh(false, event.detail);
	}

	function refresh(force: boolean, p = 1) {
		if (browser) {
			const search = `?p=${p}&q=${encodeURIComponent(data.querySearch)}`;
			if (force || search != $page.url.search) {
				goto(`${$page.url.pathname}${search}`, {
					keepFocus: true
				});
			}
		}
	}

	const handleImport = () => {
		console.log(`handleImport`);
		resetImportUserForm();
		showModal(ID_IMPORT_USER);
	};

	const handleExport = async () => {
		console.log(`handleExport`);
		const filter = {
			orderBy: {
				id: 'asc'
			},
			select: userPublicFields
		};
		const query = new URLSearchParams({ filter: encodeURIComponent(JSON.stringify(filter)) });
		const res = await fetch(`${API.USER}?${query}`);
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
	};
</script>

<div class="flex items-center justify-between">
	<IconLinkButton icon="mdi:account-plus" href={URL_ADMIN_USERS_CREATE} class="btn-accent"
		>追加</IconLinkButton
	>

	<div class="flex gap-4">
		<button class="btn btn-primary gap-2" on:click={handleImport}>
			<Icon icon="mdi:upload" height="20" />
			<span>インポート</span>
		</button>
		<button class="btn btn-primary gap-2" on:click={handleExport}>
			<Icon icon="mdi:download" height="20" />
			<span>エクスポート</span>
		</button>
	</div>
</div>

<div class="pt-4">
	<Search bind:value={data.querySearch} />
</div>

{#if data.count > 0}
	<div class="overflow-x-auto">
		<table class="table w-full mt-2">
			<!-- head -->
			<thead>
				<tr>
					<th>{fields.user.username.label}</th>
					<th>氏名</th>
					<th>氏名カナ</th>
					<th>{fields.user.abbrev.label}</th>
					<th>{fields.user.displayName.label}</th>
					<th>{fields.user.type.label}</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
				<!-- row -->
				{#each data.users as user (user.id)}
					<tr class="cursor-pointer" on:click={() => goto(URL_EDIT(user.id))}>
						<td>{user.username}</td>
						<td>{user.sei} {user.mei}</td>
						<td>{user.seiKana} {user.meiKana}</td>
						<td>{user.abbrev}</td>
						<td>{user.displayName}</td>
						<td>{userTypeString(user.type)}</td>
						<td>
							<div class="flex items-center gap-4">
								<a href={URL_EDIT(user.id)} title="編集"><Icon icon="mdi:edit" height="18" /></a>
								{#if user.type != userType.sysadmin}
									<a href={URL_DELETE(user.id)} title="削除"
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

<Modal id={ID_IMPORT_USER} class="w-11/12 max-w-4xl">
	<h4 class="my-0">インポート</h4>
	<form on:keyup={handleEscKey} method="POST" use:enhance>
		{#if fileName && jsonData}
			<p class="my-0">{fileName}</p>
			<pre class="my-0 h-[40vh] overflow-scroll">{jsonData}</pre>
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
				<input type="hidden" name="file" value={fileName} />
				<input type="hidden" name="json" value={jsonData} />
				<button class="btn btn-primary">インポート</button>
			</div>
		{:else}
			<div class="not-prose flex items-center justify-center w-full mt-4">
				<Dropzone id="selected-file" name="file" accept=".json" bind:files={selectedFiles} />
			</div>
		{/if}
	</form>
</Modal>
