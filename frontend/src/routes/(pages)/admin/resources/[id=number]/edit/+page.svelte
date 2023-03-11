<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { ActionData, PageData } from './$types';
	import { addToast } from '$lib/components/Toast.svelte';
	import InputText from '$lib/components/form/InputText.svelte';
	import { fields } from '$lib/fields';

	console.log(`/routes/(pages)/admin/users/[id=number]/edit/+page.svelte`);
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
				<InputText
					name={fields.user.username.name}
					minlength={fields.user.username.minlength}
					maxlength={fields.user.username.maxlength}
					required
					value={form?.user?.username ?? data.user.username ?? ''}
					errorMessage={form?.errors?.username}
				>
					{fields.user.username.label}
					{fields.user.username.helperText}
				</InputText>
			</div>
			<div class="form-control">
				<InputText
					name={fields.user.displayName.name}
					maxlength={fields.user.displayName.maxlength}
					required
					value={form?.user?.displayName ?? data.user.displayName ?? ''}
					errorMessage={form?.errors?.displayName}
					>{fields.user.displayName.label}{fields.user.displayName.helperText}
				</InputText>
			</div>
			<div class="form-control">
				<InputText
					name={fields.user.abbrev.name}
					maxlength={fields.user.abbrev.maxlength}
					required
					value={form?.user?.abbrev ?? data.user.abbrev ?? ''}
					errorMessage={form?.errors?.abbrev}
					>{fields.user.abbrev.label}{fields.user.abbrev.helperText}</InputText
				>
			</div>
			<div class="form-control">
				<InputText
					name={fields.user.sei.name}
					required
					value={form?.user?.sei ?? data.user.sei ?? ''}
					errorMessage={form?.errors?.sei}>{fields.user.sei.label}</InputText
				>
			</div>
			<div class="form-control">
				<InputText
					name={fields.user.mei.name}
					required
					value={form?.user?.mei ?? data.user.mei ?? ''}
					errorMessage={form?.errors?.mei}>{fields.user.mei.label}</InputText
				>
			</div>
			<div class="form-control">
				<InputText
					name={fields.user.seiKana.name}
					required
					value={form?.user?.seiKana ?? data.user.seiKana ?? ''}
					errorMessage={form?.errors?.seiKana}>{fields.user.seiKana.label}</InputText
				>
			</div>
			<div class="form-control">
				<InputText
					name={fields.user.meiKana.name}
					required
					value={form?.user?.meiKana ?? data.user.meiKana ?? ''}
					errorMessage={form?.errors?.meiKana}>{fields.user.meiKana.label}</InputText
				>
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
