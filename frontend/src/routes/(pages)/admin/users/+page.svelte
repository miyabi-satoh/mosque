<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';

	export let data: PageData;
	let selectedFiles: FileList | null = null;
	console.log(data.users);

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

	const handleClick = async (id: number) => {
		// console.log(`handleClick ${id}`);
		const res = await fetch(`/api/resource/${id}/click`);
		console.log(res.status);
	};

	const handleRemove = async (id: number) => {
		if (confirm('Are you sure to remove this user?')) {
		}
	};

	$: if (selectedFiles) {
		console.log(selectedFiles);
	}
</script>

<div class="flex gap-4">
	<label for="upload" class="btn btn-primary gap-2">
		<Icon icon="mdi:upload" />
		<span>アップロード</span>
	</label>
	<button class="btn btn-primary gap-2">
		<Icon icon="mdi:upload" />
		<span>ダウンロード</span>
	</button>
</div>

<input type="checkbox" id="upload" class="modal-toggle" />
<label for="upload" class="modal cursor-pointer">
	<div class="modal-box relative">
		<label for="upload" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
		<h4 class="my-0">アップロード</h4>
		<form method="POST" action="?/upload">
			{#if selectedFiles}
				<div class="flex items-center justify-between w-full mt-4">
					<button class="btn btn-default" on:click|preventDefault={() => (selectedFiles = null)}
						>再選択</button
					>
					<button class="btn btn-primary">インポート</button>
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
							accept=".csv,.json"
						/>
					</label>
				</div>
			{/if}
		</form>
	</div>
</label>

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
		<table class="table table-zebra w-full">
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
						<th>{user.username}</th>
						<td>{user.sei} {user.mei}</td>
						<td>{user.seiKana} {user.meiKana}</td>
						<td>{user.abbrev}</td>
						<td>{user.displayName}</td>
						<td>
							<div class="flex items-center gap-4">
								<a href="/admin/users/{user.id}/edit"><Icon icon="mdi:edit" height="18" /></a>
								{#if user.id != 1}
									<button on:click={() => handleRemove(user.id)}
										><Icon icon="mdi:trash" height="18" /></button
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
