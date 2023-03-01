<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';

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

	const handleCacheUpdate = async () => {
		// 処理対象データを取得
		// 1件ずつ処理
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

	const ellipsis = (s: string | null) => {
		if (s && s.length > 20) {
			return s.slice(0, 20) + '...';
		}
		return s;
	};
</script>

<button class="btn btn-primary gap-2" on:click={handleCacheUpdate}>
	<Icon icon="mdi:download" height="20" />
	<span>キャッシュ更新</span>
</button>

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
