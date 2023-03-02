<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';
	import Portal from 'svelte-portal/src/Portal.svelte';
	import type { Asset } from '@prisma/client';
	import { onDestroy } from 'svelte';

	console.log(`frontend/src/routes/(pages)/admin/resources/+page.svelte`);
	export let data: PageData;

	function movePage(event: CustomEvent<number>) {
		refresh(event.detail);
	}

	function refresh(p = 1) {
		const search = `?p=${p}&q=${encodeURIComponent(data.querySearch)}`;
		if (search != $page.url.search) {
			goto(`${$page.url.pathname}${search}`, {
				keepFocus: true
			});
		}
	}

	$: if (browser) {
		data.querySearch;
		refresh();
	}

	let assets: Asset[] = [];
	const handleCacheUpdate = async () => {
		assets = [];
		window.document.getElementById('cache')?.click();
		// 処理対象データを取得
		const res = await fetch(`/api/asset/uncached`);
		if (res.ok) {
			const json = await res.json();
			assets = json.assets as Asset[];
		}
	};

	let cancel = false;
	let progress = 0;
	let message = '';
	const handleClickStart = async () => {
		window.document.getElementById('cache')?.click();
		cancel = false;
		progress = 1;
		for (const asset of assets) {
			if (cancel) {
				break;
			}
			message = `(${progress}/${assets.length}) ${asset.title ?? ''}`;
			const res = await fetch(`/api/asset/${asset.id}/${asset.slug}`);
			progress++;
		}
		message = `完了`;
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

	const ellipsis = (s: string | null) => {
		if (s && s.length > 20) {
			return s.slice(0, 20) + '...';
		}
		return s;
	};
</script>

<div class="flex items-center gap-2">
	<button
		class="flex-none btn btn-primary gap-2"
		disabled={progress !== 0}
		on:click={handleCacheUpdate}
	>
		<Icon icon="mdi:download" height="20" />
		<span>キャッシュ更新</span>
	</button>
	{#if progress > 0}
		<button class="btn btn-sm btn-circle" disabled={cancel} on:click={handleCancel}>✕</button>
		<div class="flex-1">{message}</div>
	{/if}
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
					<th>タイトル</th>
					<th>説明</th>
					<th>操作</th>
				</tr>
			</thead>
			<tbody>
				<!-- row -->
				{#each data.resources as resource (resource.id)}
					<tr>
						<td>{resource.title}</td>
						<td>{ellipsis(resource.description)}</td>
						<td>
							<div class="flex items-center gap-4">
								<a href="/admin/resources/{resource.id}/edit"
									><Icon icon="mdi:edit" height="18" /></a
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

<Portal target="#modals">
	<input type="checkbox" id="cache" class="modal-toggle" />
	<label for="cache" class="modal cursor-pointer">
		<label class="modal-box" for="">
			<label for="cache" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
			<h4 class="my-0">キャッシュ更新</h4>
			<p>
				対象のデータ：{assets.length} 件
			</p>
			<button class="btn btn-primary" on:click={handleClickStart}>開始</button>
		</label>
	</label>
</Portal>
