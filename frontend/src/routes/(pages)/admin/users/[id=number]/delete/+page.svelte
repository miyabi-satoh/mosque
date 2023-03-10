<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { addToast } from '$lib/components/Toast.svelte';
	import UserForm from '$lib/components/form/UserForm.svelte';
	import {
		LABEL_ABBREV,
		LABEL_BLOCKED,
		LABEL_DISPLAYNAME,
		LABEL_USERNAME,
		type UserCreate
	} from '$lib/user';
	import { URL_ADMIN_USERS } from '$lib/constants';

	console.log(`frontend/src/routes/(pages)/admin/users/[id=number]/delete/+page.svelte`);
	export let data: PageData;
	export let form: ActionData;

	if (form && form.message) {
		addToast(form.message, `alert-error`);
	}
</script>

{#if data.user}
	<p>
		以下のユーザーを削除します。<br />
		よろしいですか？
	</p>
	<div class="flex gap-4">
		<form method="POST">
			<button class="btn btn-error">削除する</button>
		</form>
		<a href={URL_ADMIN_USERS} class="btn btn-default">キャンセル</a>
	</div>
	<div class="my-8 p-4 bg-base-300 rounded">
		<div>{LABEL_USERNAME}：{data.user.username}</div>
		<div>{LABEL_DISPLAYNAME}：{data.user.displayName}</div>
		<div>{LABEL_ABBREV}：{data.user.abbrev}</div>
		<div>氏名：{data.user.sei} {data.user.mei}</div>
		<div>カナ：{data.user.seiKana} {data.user.meiKana}</div>
		<div>{LABEL_BLOCKED}：{data.user.blocked ? `オン` : `オフ`}</div>
	</div>
{:else}
	<p>対象のデータが見つかりません。</p>
{/if}
