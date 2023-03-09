<script lang="ts">
	import IconButton from '$lib/components/form/IconButton.svelte';
	import InputText from '$lib/components/form/InputText.svelte';
	import Label from '$lib/components/form/Label.svelte';
	import { addToast } from '$lib/components/Toast.svelte';
	import type { UserCreate } from '$lib/user';
	import type { ActionData, PageData } from './$types';

	const ID_USERNAME = 'username';
	const ID_PASSWORD = 'password';
	const ID_DISPLAYNAME = 'displayname';
	const ID_ABBREV = 'abbrev';
	const ID_SEI = 'sei';
	const ID_MEI = 'mei';
	const ID_SEIKANA = 'seiKana';
	const ID_MEIKANA = 'meiKana';
	const ID_BLOCKED = 'blocked';
	export let data: PageData;
	export let form: ActionData;

	if (form) {
		if (form.success) {
			addToast(`ユーザーを追加しました。`);
		}
	}
</script>

<form method="post">
	<div class="grid gap-4 grid-cols-2">
		<div class="col-span-2 sm:col-span-1">
			<Label for={ID_USERNAME}>ユーザー名</Label>
			<InputText id={ID_USERNAME} name={ID_USERNAME} errorMessage={form?.errors?.username} />
		</div>
		<div class="col-span-2 sm:col-span-1">
			<Label for={ID_PASSWORD}>パスワード</Label>
			<InputText
				id={ID_PASSWORD}
				name={ID_PASSWORD}
				type="password"
				errorMessage={form?.errors?.password}
			/>
		</div>
		<div>
			<Label for={ID_DISPLAYNAME}>表示名</Label>
			<InputText
				id={ID_DISPLAYNAME}
				name={ID_DISPLAYNAME}
				errorMessage={form?.errors?.displayName}
			/>
		</div>
		<div>
			<Label for={ID_ABBREV}>略称</Label>
			<InputText id={ID_ABBREV} name={ID_ABBREV} errorMessage={form?.errors?.abbrev} />
		</div>
		<div>
			<Label for={ID_SEI}>姓</Label>
			<InputText id={ID_SEI} name={ID_SEI} errorMessage={form?.errors?.sei} />
		</div>
		<div>
			<Label for={ID_MEI}>名</Label>
			<InputText id={ID_MEI} name={ID_MEI} errorMessage={form?.errors?.mei} />
		</div>
		<div>
			<Label for={ID_SEIKANA}>姓(カナ)</Label>
			<InputText id={ID_SEIKANA} name={ID_SEIKANA} errorMessage={form?.errors?.seiKana} />
		</div>
		<div>
			<Label for={ID_MEIKANA}>名(カナ)</Label>
			<InputText id={ID_MEIKANA} name={ID_MEIKANA} errorMessage={form?.errors?.meiKana} />
		</div>
		<div class="form-control col-span-2">
			<label class="label cursor-pointer justify-start gap-2">
				<input type="checkbox" class="checkbox" name={ID_BLOCKED} />
				<span class="label-text">使用停止</span>
			</label>
		</div>
	</div>
	<div class="my-4">
		<IconButton icon="mdi:account-plus">追加</IconButton>
	</div>
</form>
