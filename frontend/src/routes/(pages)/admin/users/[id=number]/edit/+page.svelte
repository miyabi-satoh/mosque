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
		if (form.success === true) {
			addToast(`保存しました`, `alert-success`);
		} else if (form.success === false) {
			addToast(`エラーが発生しました`, `alert-error`);
		}
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
					value={data.user.username}
				/>
			</div>
			<div>
				<label for="displayName">表示名(5文字以内)</label>
				<input
					class="input input-bordered w-full"
					id="displayName"
					name="displayName"
					maxlength="5"
					required
					value={data.user.displayName}
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
					value={data.user.abbrev}
				/>
			</div>
			<div>
				<label for="sei">姓</label>
				<input
					class="input input-bordered w-full"
					id="sei"
					name="sei"
					required
					value={data.user.sei}
				/>
			</div>
			<div>
				<label for="mei">名</label>
				<input
					class="input input-bordered w-full"
					id="mei"
					name="mei"
					required
					value={data.user.mei}
				/>
			</div>
			<div>
				<label for="seiKana">姓(カナ)</label>
				<input
					class="input input-bordered w-full"
					id="seiKana"
					name="seiKana"
					required
					value={data.user.seiKana}
				/>
			</div>
			<div>
				<label for="seiKana">名(カナ)</label>
				<input
					class="input input-bordered w-full"
					id="meiKana"
					name="meiKana"
					required
					value={data.user.meiKana}
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
