<script lang="ts">
	import { userStore } from '$lib/user';

	$: me = $userStore;
</script>

{#if !me}
	<p>このページはログインが必要です。</p>
{:else}
	<form method="POST">
		<input type="hidden" name="id" value={me.id} />
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div class="flex flex-col">
				<label for="displayName">表示名(5文字以内)</label>
				<input
					class="input input-bordered w-full"
					id="displayName"
					name="displayName"
					maxlength="5"
					required
					bind:value={me.displayName}
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
					<input class="input input-bordered w-full" id="sei" disabled value={me.sei} />
				</div>
				<div class="flex flex-col">
					<label for="mei">名</label>
					<input class="input input-bordered w-full" id="mei" disabled value={me.mei} />
				</div>
				<div class="flex flex-col">
					<label for="seiKana">姓(カナ)</label>
					<input class="input input-bordered w-full" id="seiKana" disabled value={me.seiKana} />
				</div>
				<div class="flex flex-col">
					<label for="meiKana">名(カナ)</label>
					<input class="input input-bordered w-full" id="meiKana" disabled value={me.meiKana} />
				</div>
				<div class="flex flex-col">
					<label for="abbrev">略称</label>
					<input class="input input-bordered w-full" id="abbrev" disabled value={me.abbrev} />
				</div>
			</div>
		</div>
	</form>
{/if}
