<script>
	import { page } from '$app/stores';
	import { A, Heading, P } from 'flowbite-svelte';

	console.log($page);
</script>

<Heading tag="h1">{$page.status} {$page.error?.message}</Heading>
{#if $page.status == 404}
	<P class="w-full my-8">ご指定のページは見つかりませんでした</P>
	<P class="w-full">
		<A href={$page.url.href}>{$page.url.href}</A> は一時的にアクセスできない状況にあるか、移動もしくは削除された可能性があります。
	</P>
{/if}
