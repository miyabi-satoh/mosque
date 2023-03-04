<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { ActionData, PageData } from './$types';
	import { addToast } from '$lib/components/Toast.svelte';
	import Label from '$lib/components/form/Label.svelte';
	import InputText from '$lib/components/form/InputText.svelte';

	console.log(`frontend/src/routes/(pages)/admin/users/[id=number]/edit/+page.svelte`);
	export let data: PageData;
	export let form: ActionData;
	if (form) {
		console.log(form);
	}

	$: if (form) {
		if (form.success) {
			addToast(`保存しました`, `alert-success`);
		} else if (form.message) {
			addToast(form.message, `alert-error`);
		}
	}
</script>

{#if data.user}
	<form method="POST">
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="sm:col-span-2 form-control">
				<Label for="form-username">ユーザー名</Label>
				<InputText
					id="form-username"
					name="username"
					required
					value={form?.user?.username ?? data.user.username}
					errorMessage={form?.errors?.username}
				/>
			</div>
			<div class="form-control">
				<Label for="displayName">表示名(5文字以内)</Label>
				<InputText
					id="displayName"
					name="displayName"
					maxlength={5}
					required
					value={form?.user?.displayName ?? data.user.displayName}
					errorMessage={form?.errors?.displayName}
				/>
			</div>
			<div class="form-control">
				<Label for="abbrev">略称(5文字以内)</Label>
				<InputText
					id="abbrev"
					name="abbrev"
					maxlength={5}
					required
					value={form?.user?.abbrev ?? data.user.abbrev}
					errorMessage={form?.errors?.abbrev}
				/>
			</div>
			<div class="form-control">
				<Label for="sei">姓</Label>
				<InputText
					id="sei"
					name="sei"
					required
					value={form?.user?.sei ?? data.user.sei}
					errorMessage={form?.errors?.sei}
				/>
			</div>
			<div class="form-control">
				<Label for="mei">名</Label>
				<InputText
					id="mei"
					name="mei"
					required
					value={form?.user?.mei ?? data.user.mei}
					errorMessage={form?.errors?.mei}
				/>
			</div>
			<div class="form-control">
				<Label for="seiKana">姓(カナ)</Label>
				<InputText
					id="seiKana"
					name="seiKana"
					required
					value={form?.user?.seiKana ?? data.user.seiKana}
					errorMessage={form?.errors?.seiKana}
				/>
			</div>
			<div class="form-control">
				<Label for="seiKana">名(カナ)</Label>
				<InputText
					id="meiKana"
					name="meiKana"
					required
					value={form?.user?.meiKana ?? data.user.meiKana}
					errorMessage={form?.errors?.meiKana}
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
