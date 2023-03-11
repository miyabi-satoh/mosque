<script lang="ts">
	import { page } from '$app/stores';
	console.log(`/routes/(pages)/+error.svelte`);
</script>

<svelte:head>
	<title>MOSQUE | Error</title>
</svelte:head>

<h1>{$page.status} {$page.error?.message}</h1>
{#if $page.status == 404}
	<p>ご指定のページは見つかりませんでした</p>
	<p>
		<a class="link" href={$page.url.href}>{$page.url.href}</a> は一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。
	</p>
{:else if $page.status == 401}
	<p>
		<a class="link" href={$page.url.href}>{$page.url.href}</a> へのアクセス権がありません。
	</p>
{/if}
