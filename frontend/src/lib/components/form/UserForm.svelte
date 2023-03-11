<script lang="ts">
	import IconButton from './IconButton.svelte';
	import InputText from './InputText.svelte';
	import type { UserCreate, UserPostErrors } from '$lib/user';
	import { page } from '$app/stores';
	import { fields } from '$lib/fields';

	export let data: UserCreate | undefined;
	export let errors: UserPostErrors | undefined;
	// console.log($page);
</script>

<form method="post">
	<div class="grid gap-4 grid-cols-2">
		<div class="col-span-2 sm:col-span-1">
			<InputText
				name={fields.user.username.name}
				minlength={fields.user.username.minlength}
				maxlength={fields.user.username.maxlength}
				value={data?.username}
				required
				errorMessage={errors?.username}>{fields.user.username.label}</InputText
			>
		</div>
		<div class="col-span-2 sm:col-span-1">
			<InputText
				name={fields.user.password.name}
				minlength={fields.user.password.minlength}
				type="password"
				required={!$page.params.id}
				errorMessage={errors?.password}
				>{fields.user.password.label}
				{#if $page.params.id}
					(変更する場合に入力)
				{/if}
			</InputText>
		</div>
		<div>
			<InputText
				name={fields.user.displayName.name}
				maxlength={fields.user.displayName.maxlength}
				value={data?.displayName}
				required
				errorMessage={errors?.displayName}
				>{fields.user.displayName.label}{fields.user.displayName.helperText}</InputText
			>
		</div>
		<div>
			<InputText
				name={fields.user.abbrev.name}
				maxlength={fields.user.abbrev.maxlength}
				value={data?.abbrev}
				required
				errorMessage={errors?.abbrev}
				>{fields.user.abbrev.label}{fields.user.abbrev.helperText}</InputText
			>
		</div>
		<div>
			<InputText name={fields.user.sei.name} value={data?.sei} required errorMessage={errors?.sei}>
				{fields.user.sei.label}</InputText
			>
		</div>
		<div>
			<InputText name={fields.user.mei.name} value={data?.mei} required errorMessage={errors?.mei}>
				{fields.user.mei.label}</InputText
			>
		</div>
		<div>
			<InputText
				name={fields.user.seiKana.name}
				value={data?.seiKana}
				required
				errorMessage={errors?.seiKana}>{fields.user.seiKana.label}</InputText
			>
		</div>
		<div>
			<InputText
				name={fields.user.meiKana.name}
				value={data?.meiKana}
				required
				errorMessage={errors?.meiKana}>{fields.user.meiKana.label}</InputText
			>
		</div>
		<div class="form-control col-span-2">
			<label class="label cursor-pointer justify-start gap-2">
				<input
					type="checkbox"
					class="checkbox"
					name={fields.user.blocked.name}
					checked={data?.blocked}
				/>
				<span class="label-text">{fields.user.blocked.label}</span>
			</label>
		</div>
	</div>
	<div class="my-4">
		<IconButton icon="mdi:check">保存</IconButton>
	</div>
</form>
