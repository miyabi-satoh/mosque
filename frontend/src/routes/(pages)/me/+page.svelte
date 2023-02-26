<script lang="ts">
	import type { ActionData } from './$types';
	import { addToast } from '$lib/components/Toast.svelte';
	import { userStore } from '$lib/user';

	export let form: ActionData;
	$: if (form?.message) {
		addToast(form.message, form.user ? 'alert-success' : 'alert-error');
		if (form.user) {
			$userStore = form.user;
		}
	}
</script>

{#if !$userStore}
	<p>このページはログインが必要です。</p>
{:else}
	<form method="POST">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div class="flex flex-col">
				<label for="displayName">表示名(5文字以内)</label>
				<input
					class="input input-bordered w-full"
					id="displayName"
					name="displayName"
					maxlength="5"
					required
					value={$userStore.displayName}
				/>
			</div>
			<div class="flex items-end">
				<button class="btn btn-primary">保存</button>
			</div>
		</div>
		<div class="bg-base-300 mt-4 p-4">
			以下のプロパティは編集できません。 修正が必要な場合は管理者に申請してください。
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
				<div class="flex flex-col">
					<label for="sei">姓</label>
					<input class="input input-bordered w-full" id="sei" disabled value={$userStore.sei} />
				</div>
				<div class="flex flex-col">
					<label for="mei">名</label>
					<input class="input input-bordered w-full" id="mei" disabled value={$userStore.mei} />
				</div>
				<div class="flex flex-col">
					<label for="seiKana">姓(カナ)</label>
					<input
						class="input input-bordered w-full"
						id="seiKana"
						disabled
						value={$userStore.seiKana}
					/>
				</div>
				<div class="flex flex-col">
					<label for="meiKana">名(カナ)</label>
					<input
						class="input input-bordered w-full"
						id="meiKana"
						disabled
						value={$userStore.meiKana}
					/>
				</div>
				<div class="flex flex-col">
					<label for="abbrev">略称</label>
					<input
						class="input input-bordered w-full"
						id="abbrev"
						disabled
						value={$userStore.abbrev}
					/>
				</div>
			</div>
		</div>
	</form>
{/if}
