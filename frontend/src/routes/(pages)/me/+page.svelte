<script lang="ts">
	import type { ActionData } from './$types';
	import { addToast } from '$lib/components/Toast.svelte';
	import { userStore } from '$lib/user';
	import Label from '$lib/components/form/Label.svelte';
	import { fields } from '$lib/fields';
	import InputText from '$lib/components/form/InputText.svelte';

	export let form: ActionData;
	$: if (form?.message) {
		addToast(form.message, form.success ? 'alert-success' : 'alert-error');
	}
</script>

{#if !$userStore}
	<p>このページはログインが必要です。</p>
{:else}
	<form method="POST">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div class="flex flex-col">
				<Label for={fields.user.displayName.name}>
					{fields.user.displayName.label}
					{fields.user.displayName.helperText}
				</Label>
				<InputText
					id={fields.user.displayName.name}
					name={fields.user.displayName.name}
					maxlength={fields.user.displayName.maxlength}
					required
					value={$userStore.displayName}
					errorMessage={form?.errors?.displayName}
				/>
			</div>
			<div class="flex items-end">
				<button class="btn btn-primary">保存</button>
			</div>
		</div>
	</form>
	<div class="bg-base-300 mt-4 p-4">
		以下のプロパティは編集できません。 修正が必要な場合は管理者に申請してください。
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
			<div class="flex flex-col">
				<Label for={fields.user.sei.name}>
					{fields.user.sei.label}
				</Label>
				<InputText id={fields.user.sei.name} disabled value={$userStore.sei} />
			</div>
			<div class="flex flex-col">
				<Label for={fields.user.mei.name}>
					{fields.user.mei.label}
				</Label>
				<InputText id={fields.user.mei.name} disabled value={$userStore.mei} />
			</div>
			<div class="flex flex-col">
				<Label for={fields.user.seiKana.name}>
					{fields.user.seiKana.label}
				</Label>
				<InputText id={fields.user.seiKana.name} disabled value={$userStore.seiKana} />
			</div>
			<div class="flex flex-col">
				<Label for={fields.user.meiKana.name}>
					{fields.user.meiKana.label}</Label
				>
				<InputText id={fields.user.meiKana.name} disabled value={$userStore.meiKana} />
			</div>
			<div class="flex flex-col">
				<Label for={fields.user.abbrev.name}>
					{fields.user.abbrev.label}</Label
				>
				<InputText id={fields.user.abbrev.name} disabled value={$userStore.abbrev} />
			</div>
		</div>
	</div>
{/if}
