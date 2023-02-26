<script>
	import { page } from '$app/stores';

	// console.log($page);
</script>

<svelte:head>
	<title>MOSQUE | Error</title>
</svelte:head>

<div class="my-8 text-center lg:text-left">
	<h1>{$page.status} {$page.error?.message}</h1>
</div>
{#if $page.status == 404}
	<p class="my-8">ご指定のページは見つかりませんでした</p>
	<p>
		<a href={$page.url.href}>{$page.url.href}</a> は一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。
	</p>
{/if}
