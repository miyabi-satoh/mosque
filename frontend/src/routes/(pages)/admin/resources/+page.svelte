<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onDestroy } from 'svelte';
	import type { Asset } from '@prisma/client';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { API, URL_ADMIN_RESOURCES, URL_ADMIN_RESOURCES_CREATE } from '$lib/constants';
	import { fields } from '$lib/fields';
	import Modal, { closeModal } from '$lib/components/organisms/Modal.svelte';
	import { addToast } from '$lib/components/organisms/Toast.svelte';
	import IconLinkButton from '$lib/components/molecules/IconLinkButton.svelte';
	import IconButton from '$lib/components/molecules/IconButton.svelte';
	import Pagination from '$lib/components/organisms/Pagination.svelte';
	import { Search } from '$lib/components';

	console.log(`/routes/(pages)/admin/resources/+page.svelte`);
	const URL_EDIT = (id: number) => `${URL_ADMIN_RESOURCES}/${id}/edit`;
	const URL_DELETE = (id: number) => `${URL_ADMIN_RESOURCES}/${id}/delete`;
	const ID_UPDATE_CACHE = 'update-cache-modal';
	export let data: PageData;
	let assets: Asset[] = [];
	let cancel = false;
	let progress = 0;
	let message = '';
	let errors: string[] = [];

	$: searchReaction(data.querySearch);
	const searchReaction = (_search: string) => {
		console.log(`search reaction`);
		refresh();
	};

	const handleEscKey = (event: KeyboardEvent) => {
		if (event.key == 'Escape') {
			closeModal(ID_UPDATE_CACHE);
		}
	};

	const handleUpdateCache = async () => {
		console.log(`handleUpdateCache`);
		if (!cancel && progress == 0) {
			const res = await fetch(API.ASSET);
			if (res.ok) {
				assets = await res.json();
			} else {
				assets = [];
			}
		}
	};

	const handleStartUpdateCache = async () => {
		console.log('handleStartUpdateCache');
		cancel = false;
		errors = [];
		progress = 1;
		for (const asset of assets) {
			if (cancel) {
				break;
			}
			message = `(${progress}/${assets.length}) ${asset.title ?? ''}`;
			const res = await fetch(`${API.ASSET}/${asset.id}/${asset.slug}`);
			if (!res.ok) {
				errors = [...errors, `${res.status} ${res.statusText} - ${asset.title ?? ''}`];
			} else {
				progress++;
			}
		}
		closeModal(ID_UPDATE_CACHE);
		if (cancel) {
			addToast(`中断しました。`, 'alert-warning');
		} else {
			addToast(`完了しました。`, 'alert-success');
		}
		assets = [];
		progress = 0;
		cancel = false;
	};

	const handleCancel = () => {
		console.log(`handleCancel`);
		cancel = true;
	};
	onDestroy(handleCancel);

	function movePage(event: CustomEvent<number>) {
		refresh(event.detail);
	}

	function refresh(p = 1) {
		if (browser) {
			const search = `?p=${p}&q=${encodeURIComponent(data.querySearch)}`;
			if (search != $page.url.search) {
				goto(`${$page.url.pathname}${search}`, {
					keepFocus: true
				});
			}
		}
	}

	const ellipsis = (s: string | null) => {
		if (s && s.length > 20) {
			return s.slice(0, 20) + '...';
		}
		return s;
	};
</script>

<div class="flex justify-between">
	<IconLinkButton icon="mdi:file-plus" href={URL_ADMIN_RESOURCES_CREATE} class="btn-accent"
		>追加</IconLinkButton
	>
	<div class="flex flex-col">
		<IconButton icon="mdi:file-refresh" for={ID_UPDATE_CACHE} on:click={handleUpdateCache}
			>キャッシュ更新</IconButton
		>
		<progress class="progress progress-info" value={progress} max={assets.length} />
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
					<th>{fields.resource.title.label}</th>
					<th>{fields.resource.description.label}</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
				<!-- row -->
				{#each data.resources as resource (resource.id)}
					<tr class="cursor-pointer" on:click={() => goto(URL_EDIT(resource.id))}>
						<td>{resource.title}</td>
						<td>{ellipsis(resource.description)}</td>
						<td>
							<div class="flex items-center gap-4">
								<a href={URL_EDIT(resource.id)}><Icon icon="mdi:edit" height="18" /></a>
								<a href={URL_DELETE(resource.id)} title="削除"
									><Icon icon="mdi:trash" height="18" /></a
								>
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

<Modal id={ID_UPDATE_CACHE}>
	<h4 class="my-0">キャッシュ更新</h4>
	<form on:keyup={handleEscKey}>
		{#if errors.length > 0}
			<div class="overflow-scroll max-h-16 bg-error text-error-content">
				{#each errors as err}
					<div class="whitespace-nowrap">{err}</div>
				{/each}
			</div>
		{/if}
		{#if progress > 0}
			<div>{message}</div>
			<div class="mt-2 flex justify-end">
				<button class="btn" disabled={cancel} on:click|preventDefault={handleCancel}>中断</button>
			</div>
		{:else}
			<div>対象のデータ：{assets.length} 件</div>
			{#if assets.length > 0}
				<div class="mt-2 flex justify-end">
					<button class="btn btn-primary" on:click|preventDefault={handleStartUpdateCache}
						>開始</button
					>
				</div>
			{/if}
		{/if}
	</form>
</Modal>
