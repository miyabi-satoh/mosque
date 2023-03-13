<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { addToast } from '$lib/components/Toast.svelte';
	import { MSG, URL_ADMIN_USERS } from '$lib/constants';
	import { fields } from '$lib/fields';
	import { enhance } from '$app/forms';

	console.log(`/routes/(pages)/admin/users/[id=number]/delete/+page.svelte`);
	export let data: PageData;
	export let form: ActionData;

	$: if (form && form.message) {
		addToast(form.message, `alert-error`);
	}
</script>

{#if data.user}
	<p>
		以下のユーザーを削除します。<br />
		よろしいですか？
	</p>
	<div class="flex gap-4">
		<form method="POST" use:enhance>
			<button class="btn btn-error">削除する</button>
		</form>
		<a href={URL_ADMIN_USERS} class="btn btn-default">キャンセル</a>
	</div>
	<div class="my-8 p-4 bg-base-300 rounded">
		<div>{fields.user.username.label}: {data.user.username}</div>
		<div>{fields.user.displayName.label}: {data.user.displayName}</div>
		<div>{fields.user.abbrev.label}: {data.user.abbrev}</div>
		<div>氏名: {data.user.sei} {data.user.mei}</div>
		<div>カナ: {data.user.seiKana} {data.user.meiKana}</div>
		<div>{fields.user.blocked.label}: {data.user.blocked ? `オン` : `オフ`}</div>
	</div>
{:else}
	<p>{MSG.TARGET_NOT_FOUND}</p>
{/if}
