<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Pagination from '$lib/components/Pagination.svelte';
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';
	import { addToast } from '$lib/components/Toast.svelte';

	console.log(`frontend/src/routes/(pages)/admin/users/[id=number]/edit/+page.svelte`);
	export let data: PageData;
	export let form: ActionData;
	if (form) {
		console.log(form);
	}

	if (form?.success) {
		addToast(`保存しました`, `alert-success`);
	}
	if (form?.message) {
		addToast(form.message, `alert-error`);
	}
</script>

{#if data.user}
	<form method="POST">
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="sm:col-span-2">
				<label for="form-username">ユーザー名</label>
				<input
					class="input input-bordered w-full"
					id="form-username"
					name="username"
					required
					value={form?.user?.username ?? data.user.username}
				/>
				{#if form?.errors?.username}
					<div class="bg-error text-error-content mt-1 px-2 rounded">{form.errors.username}</div>
				{/if}
			</div>
			<div>
				<label for="displayName">表示名(5文字以内)</label>
				<input
					class="input input-bordered w-full"
					id="displayName"
					name="displayName"
					maxlength="5"
					required
					value={form?.user?.displayName ?? data.user.displayName}
				/>
			</div>
			<div>
				<label for="abbrev">略称(5文字以内)</label>
				<input
					class="input input-bordered w-full"
					id="abbrev"
					name="abbrev"
					maxlength="5"
					required
					value={form?.user?.abbrev ?? data.user.abbrev}
				/>
			</div>
			<div>
				<label for="sei">姓</label>
				<input
					class="input input-bordered w-full"
					id="sei"
					name="sei"
					required
					value={form?.user?.sei ?? data.user.sei}
				/>
			</div>
			<div>
				<label for="mei">名</label>
				<input
					class="input input-bordered w-full"
					id="mei"
					name="mei"
					required
					value={form?.user?.mei && data.user.mei}
				/>
			</div>
			<div>
				<label for="seiKana">姓(カナ)</label>
				<input
					class="input input-bordered w-full"
					id="seiKana"
					name="seiKana"
					required
					value={form?.user?.seiKana ?? data.user.seiKana}
				/>
			</div>
			<div>
				<label for="seiKana">名(カナ)</label>
				<input
					class="input input-bordered w-full"
					id="meiKana"
					name="meiKana"
					required
					value={form?.user?.meiKana ?? data.user.meiKana}
				/>
			</div>
		</div>
		<button class="btn btn-primary mt-4">
			<Icon icon="mdi:check" />
			<span class="ml-2">保存</span>
		</button>
	</form>
{:else}
	<p>対象のデータが見つかりません。</p>
{/if}
