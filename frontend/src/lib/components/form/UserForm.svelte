<script lang="ts">
	import { page } from '$app/stores';
	import type { UserCreate, UserPostErrors } from '$lib/user';
	import IconButton from './IconButton.svelte';
	import InputText from './InputText.svelte';
	import Label from './Label.svelte';

	const ID_USERNAME = 'username';
	const ID_PASSWORD = 'password';
	const ID_DISPLAYNAME = 'displayName';
	const ID_ABBREV = 'abbrev';
	const ID_SEI = 'sei';
	const ID_MEI = 'mei';
	const ID_SEIKANA = 'seiKana';
	const ID_MEIKANA = 'meiKana';
	const ID_BLOCKED = 'blocked';

	export let data: UserCreate | undefined;
	export let errors: UserPostErrors | undefined;
	// console.log($page);
</script>

<form method="post">
	<div class="grid gap-4 grid-cols-2">
		<div class="col-span-2 sm:col-span-1">
			<Label for={ID_USERNAME}>ユーザー名</Label>
			<InputText
				id={ID_USERNAME}
				name={ID_USERNAME}
				minlength={4}
				maxlength={20}
				value={data?.username}
				required
				errorMessage={errors?.username}
			/>
		</div>
		<div class="col-span-2 sm:col-span-1">
			<Label for={ID_PASSWORD}>
				パスワード
				{#if $page.params.id}
					(変更する場合に入力)
				{/if}
			</Label>
			<InputText
				id={ID_PASSWORD}
				name={ID_PASSWORD}
				minlength={4}
				type="password"
				required={!$page.params.id}
				errorMessage={errors?.password}
			/>
		</div>
		<div>
			<Label for={ID_DISPLAYNAME}>表示名(5文字以内)</Label>
			<InputText
				id={ID_DISPLAYNAME}
				name={ID_DISPLAYNAME}
				maxlength={5}
				value={data?.displayName}
				required
				errorMessage={errors?.displayName}
			/>
		</div>
		<div>
			<Label for={ID_ABBREV}>略称(5文字以内)</Label>
			<InputText
				id={ID_ABBREV}
				name={ID_ABBREV}
				maxlength={5}
				value={data?.abbrev}
				required
				errorMessage={errors?.abbrev}
			/>
		</div>
		<div>
			<Label for={ID_SEI}>姓</Label>
			<InputText id={ID_SEI} name={ID_SEI} value={data?.sei} required errorMessage={errors?.sei} />
		</div>
		<div>
			<Label for={ID_MEI}>名</Label>
			<InputText id={ID_MEI} name={ID_MEI} value={data?.mei} required errorMessage={errors?.mei} />
		</div>
		<div>
			<Label for={ID_SEIKANA}>姓(ふりがな)</Label>
			<InputText
				id={ID_SEIKANA}
				name={ID_SEIKANA}
				value={data?.seiKana}
				required
				errorMessage={errors?.seiKana}
			/>
		</div>
		<div>
			<Label for={ID_MEIKANA}>名(ふりがな)</Label>
			<InputText
				id={ID_MEIKANA}
				name={ID_MEIKANA}
				value={data?.meiKana}
				required
				errorMessage={errors?.meiKana}
			/>
		</div>
		<div class="form-control col-span-2">
			<label class="label cursor-pointer justify-start gap-2">
				<input type="checkbox" class="checkbox" name={ID_BLOCKED} checked={data?.blocked} />
				<span class="label-text">使用停止</span>
			</label>
		</div>
	</div>
	<div class="my-4">
		<IconButton icon="mdi:check">保存</IconButton>
	</div>
</form>
