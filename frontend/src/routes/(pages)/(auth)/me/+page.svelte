<script lang="ts">
	import type { ActionData } from './$types';
	import type { PageData } from './$types';
	import { addToast } from '$lib/components/Toast.svelte';
	import { fields } from '$lib/fields';
	import InputText from '$lib/components/form/InputText.svelte';

	export let data: PageData;
	export let form: ActionData;
	$: if (form?.message) {
		addToast(form.message, form.success ? 'alert-success' : 'alert-error');
	}
</script>

{#if !data.me}
	<p>このページはログインが必要です。</p>
{:else}
	<form method="POST">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div class="flex flex-col">
				<InputText
					name={fields.user.displayName.name}
					maxlength={fields.user.displayName.maxlength}
					required
					value={data.me.displayName}
					errorMessage={form?.errors?.displayName}
				>
					{fields.user.displayName.label}
					{fields.user.displayName.helperText}
				</InputText>
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
				<InputText disabled value={data.me.sei}>
					{fields.user.sei.label}
				</InputText>
			</div>
			<div class="flex flex-col">
				<InputText disabled value={data.me.mei}>
					{fields.user.mei.label}
				</InputText>
			</div>
			<div class="flex flex-col">
				<InputText disabled value={data.me.seiKana}>
					{fields.user.seiKana.label}
				</InputText>
			</div>
			<div class="flex flex-col">
				<InputText disabled value={data.me.meiKana}>
					{fields.user.meiKana.label}
				</InputText>
			</div>
			<div class="flex flex-col">
				<InputText disabled value={data.me.abbrev}>
					{fields.user.abbrev.label}
				</InputText>
			</div>
		</div>
	</div>
{/if}
