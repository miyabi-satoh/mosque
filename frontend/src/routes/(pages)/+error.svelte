<script>
	import { page } from '$app/stores';
</script>

<h1>{$page.status} {$page.error?.message}</h1>
{#if $page.status == 404}
	<p>ご指定のページは見つかりませんでした</p>
	<p>
		<a class="link" href={$page.url.href}>{$page.url.href}</a> は一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。
	</p>
{/if}
