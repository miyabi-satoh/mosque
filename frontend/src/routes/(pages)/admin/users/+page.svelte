<script lang="ts">
	import Icon from '@iconify/svelte';
	import Portal from 'svelte-portal/src/Portal.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import { browser } from '$app/environment';
	import IconLinkButton from '$lib/components/form/IconLinkButton.svelte';

	const URL_USER_CREATE = `${$page.url.pathname}/create`;
	const URL_USER_EDIT = (id: number) => `${$page.url.pathname}/${id}/edit`;
	const URL_USER_DELETE = (id: number) => `${$page.url.pathname}/${id}/delete`;

	export let data: PageData;
	let selectedFiles: FileList | null = null;

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
	let textData: string;
	const setPreview = async (files: FileList) => {
		const file = files[0];
		if (file) {
			textData = await file.text();
		}
	};

	const handleExport = async () => {
		const res = await fetch(`/api/user/export`);
		if (res.ok) {
			const blob = await res.blob();
			const url = URL.createObjectURL(blob);

			const a = window.document.createElement('a');
			a.download = `export_mosque_user.csv`;
			a.href = url;
			a.click();
		}
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

<Portal target="#modals">
	<input type="checkbox" id="upload" class="modal-toggle" />
	<label for="upload" class="modal cursor-pointer">
		<label class="modal-box w-2/3" class:max-w-2xl={textData} for="">
			<label for="upload" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
			<h4 class="my-0">インポート</h4>
			{#if selectedFiles}
				{#if textData}
					<pre class="h-[40vh] overflow-scroll">{textData}</pre>
				{/if}
				<div class="flex items-center justify-between w-full mt-4">
					<button
						class="btn btn-default"
						on:click|preventDefault={() => {
							selectedFiles = null;
							textData = '';
						}}>再選択</button
					>
					<form method="POST" action="?/upload">
						<input type="hidden" name="body" value={textData} />
						<button class="btn btn-primary">インポート</button>
					</form>
				</div>
			{:else}
				<div class="flex items-center justify-center w-full mt-4">
					<label
						for="selected-file"
						class="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer"
					>
						<div class="flex flex-col items-center justify-center p-6">
							<Icon icon="mdi:cloud-upload-outline" height="auto" />
							<p class="text-sm">ここにファイルをドロップするか、クリックしてファイルを選択</p>
						</div>
						<input
							id="selected-file"
							name="file"
							type="file"
							class="hidden"
							bind:files={selectedFiles}
							accept=".txt,.csv,.json"
						/>
					</label>
				</div>
			{/if}
		</label>
	</label>
</Portal>
