<script lang="ts">
	import { userType, userTypeString, type UserUpdate } from '$lib/user';
	import { page } from '$app/stores';
	import { fields } from '$lib/fields';
	import { enhance } from '$app/forms';
	import type { PostErros } from '$lib/types';
	import { URL_ADMIN_USERS } from '$lib/constants';
	import InputText from '../molecules/InputText.svelte';
	import IconLinkButton from '../molecules/IconLinkButton.svelte';
	import IconButton from '../molecules/IconButton.svelte';

	type Schema = UserUpdate;
	export let data: Schema | undefined;
	export let errors: PostErros<Schema> | undefined;
</script>

<form
	method="post"
	use:enhance={() => {
		return async ({ update }) => {
			await update({ reset: false });
		};
	}}
>
	<div class="grid gap-4 grid-cols-2">
		<div class="col-span-2 sm:col-span-1">
			<InputText
				name={fields.user.username.name}
				minlength={fields.user.username.minlength}
				maxlength={fields.user.username.maxlength}
				value={data?.username}
				required
				errorMessage={errors?.username}
				>{fields.user.username.label}{fields.user.username.helperText}</InputText
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
		<div class="form-control">
			<label for="" class="label label-text">{fields.user.type.label}</label>
			<select class="select select-bordered w-full" name={fields.user.type.name}>
				{#each Object.values(userType).reverse() as val}
					<option value={val} selected={val === data?.type}>{userTypeString(val)}</option>
				{/each}
			</select>
		</div>
		<div class="form-control justify-center">
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
	<div class="my-4 flex justify-between">
		<IconLinkButton class="" icon="mdi:arrow-left" href={URL_ADMIN_USERS}>戻る</IconLinkButton>
		<IconButton icon="mdi:check">保存</IconButton>
	</div>
</form>
