<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';

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

	const handleClick = async (id: number) => {
		// console.log(`handleClick ${id}`);
		const res = await fetch(`/api/resource/${id}/click`);
		console.log(res.status);
	};

	const handleRemove = async (id: number) => {
		if (confirm('Are you sure to remove this user?')) {
		}
	};
</script>

<div class="py-4 flex flex-col md:flex-row gap-2">
	<input
		bind:value={data.querySearch}
		type="text"
		placeholder="Search keywords..."
		class="input input-bordered md:flex-1"
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
								<a href="/admin/users/{user.id}/edit"><Icon icon="mdi:edit" height="auto" /></a>
								<button on:click={() => handleRemove(user.id)}
									><Icon icon="mdi:trash" height="auto" /></button
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
